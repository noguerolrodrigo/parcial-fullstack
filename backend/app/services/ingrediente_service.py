from fastapi import HTTPException
from app.uow import UnitOfWork
from app.schemas.ingrediente import IngredienteCreate
from app.models.ingrediente import Ingrediente

def get_all(uow: UnitOfWork, offset: int = 0, limit: int = 10):
    return uow.ingredientes.get_all(offset, limit)

def get_by_id(uow: UnitOfWork, ingrediente_id: int):
    ingrediente = uow.ingredientes.get_by_id(ingrediente_id)
    if not ingrediente:
        raise HTTPException(status_code=404, detail="Ingrediente no encontrado")
    return ingrediente

def create(uow: UnitOfWork, data: IngredienteCreate):
    db_ingrediente = Ingrediente.model_validate(data)
    uow.ingredientes.add(db_ingrediente)
    uow.commit()
    uow.session.refresh(db_ingrediente)
    return db_ingrediente

def update(uow: UnitOfWork, ingrediente_id: int, data: IngredienteCreate):
    db_ingrediente = get_by_id(uow, ingrediente_id)
    datos = data.model_dump(exclude_unset=True)
    db_ingrediente.sqlmodel_update(datos)
    
    uow.ingredientes.add(db_ingrediente)
    uow.commit()
    uow.session.refresh(db_ingrediente)
    return db_ingrediente

def delete(uow: UnitOfWork, ingrediente_id: int):
    db_ingrediente = get_by_id(uow, ingrediente_id)
    uow.ingredientes.delete(db_ingrediente)
    uow.commit()