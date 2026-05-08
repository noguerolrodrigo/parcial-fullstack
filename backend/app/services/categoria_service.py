from fastapi import HTTPException
from app.uow import UnitOfWork
from app.schemas.categoria import CategoriaCreate
from app.models.categoria import Categoria

def get_all(uow: UnitOfWork, offset: int = 0, limit: int = 10):
    return uow.categorias.get_all(offset, limit)

def get_by_id(uow: UnitOfWork, id: int):
    categoria = uow.categorias.get_by_id(id)
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    return categoria

def create(uow: UnitOfWork, data: CategoriaCreate):
    db_categoria = Categoria.model_validate(data)
    uow.categorias.add(db_categoria)
    uow.commit() # El UoW se encarga de guardar
    uow.session.refresh(db_categoria)
    return db_categoria

def update(uow: UnitOfWork, categoria_id: int, data: CategoriaCreate):
    db_categoria = get_by_id(uow, categoria_id)
    datos = data.model_dump(exclude_unset=True)
    db_categoria.sqlmodel_update(datos)
    
    uow.categorias.add(db_categoria)
    uow.commit()
    uow.session.refresh(db_categoria)
    return db_categoria

def delete(uow: UnitOfWork, categoria_id: int):
    db_categoria = get_by_id(uow, categoria_id)
    uow.categorias.delete(db_categoria)
    uow.commit()