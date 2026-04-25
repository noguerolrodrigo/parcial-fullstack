from sqlmodel import Session, select
from fastapi import HTTPException
from app.models.producto import Producto, ProductoIngrediente
from app.models.ingrediente import Ingrediente
# Importamos el schema de creación
from app.schemas.producto import ProductoCreate

def get_all(session: Session, offset: int = 0, limit: int = 10):
    return session.exec(select(Producto).offset(offset).limit(limit)).all()

def get_by_id(session: Session, producto_id: int):
    producto = session.get(Producto, producto_id)
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return producto

def create(session: Session, data: ProductoCreate):
    # Separamos los IDs de ingredientes
    ingrediente_ids = data.ingrediente_ids
    datos_producto = data.model_dump(exclude={"ingrediente_ids"})
    
    # Creamos el producto base
    db_producto = Producto(**datos_producto)
    session.add(db_producto)
    session.commit()
    session.refresh(db_producto)
    
    # Vinculamos con cada ingrediente recibido
    if ingrediente_ids:
        for ing_id in ingrediente_ids:
            ingrediente = session.get(Ingrediente, ing_id)
            if not ingrediente:
                raise HTTPException(status_code=404, detail=f"Ingrediente {ing_id} no encontrado")
            link = ProductoIngrediente(producto_id=db_producto.id, ingrediente_id=ing_id)
            session.add(link)
        
    session.commit()
    session.refresh(db_producto)
    return db_producto

def update(session: Session, producto_id: int, data: ProductoCreate):
    db_producto = get_by_id(session, producto_id)
    
    ingrediente_ids = data.ingrediente_ids
    datos_actualizados = data.model_dump(exclude={"ingrediente_ids"}, exclude_unset=True)
    
    # Actualizamos campos básicos
    db_producto.sqlmodel_update(datos_actualizados)
    session.add(db_producto)
    
    # Limpiamos relaciones viejas para poner las nuevas
    links_viejos = session.exec(
        select(ProductoIngrediente).where(ProductoIngrediente.producto_id == producto_id)
    ).all()
    for link in links_viejos:
        session.delete(link)
        
    # Agregamos las nuevas relaciones
    if ingrediente_ids:
        for ing_id in ingrediente_ids:
            ingrediente = session.get(Ingrediente, ing_id)
            if not ingrediente:
                raise HTTPException(status_code=404, detail=f"Ingrediente {ing_id} no encontrado")
            link = ProductoIngrediente(producto_id=producto_id, ingrediente_id=ing_id)
            session.add(link)
        
    session.commit()
    session.refresh(db_producto)
    return db_producto

def delete(session: Session, producto_id: int):
    db_producto = get_by_id(session, producto_id)
    
    # Primero borramos los vínculos en la tabla intermedia
    links = session.exec(
        select(ProductoIngrediente).where(ProductoIngrediente.producto_id == producto_id)
    ).all()
    for link in links:
        session.delete(link)
        
    session.delete(db_producto)
    session.commit()