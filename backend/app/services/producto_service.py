from sqlmodel import select
from fastapi import HTTPException
from app.uow import UnitOfWork
from app.models.producto import Producto, ProductoIngrediente
from app.schemas.producto import ProductoCreate

def get_all(uow: UnitOfWork, offset: int = 0, limit: int = 10):
    return uow.productos.get_all(offset, limit)

def get_by_id(uow: UnitOfWork, producto_id: int):
    producto = uow.productos.get_by_id(producto_id)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return producto

def create(uow: UnitOfWork, data: ProductoCreate):
    ingrediente_ids = data.ingrediente_ids
    datos_producto = data.model_dump(exclude={"ingrediente_ids"})
    
    db_producto = Producto(**datos_producto)
    uow.productos.add(db_producto)
    uow.commit() 
    uow.session.refresh(db_producto)
    
    # Vinculamos ingredientes
    if ingrediente_ids:
        for ing_id in ingrediente_ids:
            ingrediente = uow.ingredientes.get_by_id(ing_id)
            if not ingrediente:
                raise HTTPException(status_code=404, detail=f"Ingrediente {ing_id} no encontrado")
            link = ProductoIngrediente(producto_id=db_producto.id, ingrediente_id=ing_id)
            uow.session.add(link)
        
    uow.commit()
    uow.session.refresh(db_producto)
    return db_producto

def update(uow: UnitOfWork, producto_id: int, data: ProductoCreate):
    db_producto = get_by_id(uow, producto_id)
    
    ingrediente_ids = data.ingrediente_ids
    datos_actualizados = data.model_dump(exclude={"ingrediente_ids"}, exclude_unset=True)
    
    db_producto.sqlmodel_update(datos_actualizados)
    uow.productos.add(db_producto)
    
    # Limpiamos relaciones viejas
    links_viejos = uow.session.exec(
        select(ProductoIngrediente).where(ProductoIngrediente.producto_id == producto_id)
    ).all()
    for link in links_viejos:
        uow.session.delete(link)
        
    # Ponemos las nuevas
    if ingrediente_ids:
        for ing_id in ingrediente_ids:
            ingrediente = uow.ingredientes.get_by_id(ing_id)
            if not ingrediente:
                raise HTTPException(status_code=404, detail=f"Ingrediente {ing_id} no encontrado")
            link = ProductoIngrediente(producto_id=producto_id, ingrediente_id=ing_id)
            uow.session.add(link)
        
    uow.commit()
    uow.session.refresh(db_producto)
    return db_producto

def delete(uow: UnitOfWork, producto_id: int):
    db_producto = get_by_id(uow, producto_id)
    
    # Limpiar tabla intermedia primero
    links = uow.session.exec(
        select(ProductoIngrediente).where(ProductoIngrediente.producto_id == producto_id)
    ).all()
    for link in links:
        uow.session.delete(link)
        
    uow.productos.delete(db_producto)
    uow.commit()