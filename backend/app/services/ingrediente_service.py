from sqlmodel import Session, select
from fastapi import HTTPException
from app.models.ingrediente import Ingrediente
# Importamos el esquema de validación
from app.schemas.ingrediente import IngredienteCreate

def get_all(session: Session, offset: int = 0, limit: int = 10):
    return session.exec(select(Ingrediente).offset(offset).limit(limit)).all()

def get_by_id(session: Session, ingrediente_id: int):
    ingrediente = session.get(Ingrediente, ingrediente_id)
    if not ingrediente:
        raise HTTPException(status_code=404, detail="Ingrediente no encontrado")
    return ingrediente

def create(session: Session, data: IngredienteCreate):
    db_ingrediente = Ingrediente.model_validate(data)
    session.add(db_ingrediente)
    session.commit()
    session.refresh(db_ingrediente)
    return db_ingrediente

def update(session: Session, ingrediente_id: int, data: IngredienteCreate):
    db_ingrediente = get_by_id(session, ingrediente_id)
    datos = data.model_dump(exclude_unset=True)
    db_ingrediente.sqlmodel_update(datos)
    session.add(db_ingrediente)
    session.commit()
    session.refresh(db_ingrediente)
    return db_ingrediente

def delete(session: Session, ingrediente_id: int):
    db_ingrediente = get_by_id(session, ingrediente_id)
    session.delete(db_ingrediente)
    session.commit()