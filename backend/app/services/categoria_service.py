from sqlmodel import Session, select
from fastapi import HTTPException
from app.models.categoria import Categoria
# Cambiamos la importación al nuevo archivo de schemas
from app.schemas.categoria import CategoriaCreate 

def get_all(session: Session, offset: int = 0, limit: int = 10):
    return session.exec(select(Categoria).offset(offset).limit(limit)).all()

def get_by_id(session: Session, categoria_id: int):
    categoria = session.get(Categoria, categoria_id)
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    return categoria

def create(session: Session, data: CategoriaCreate):
    db_categoria = Categoria.model_validate(data)
    session.add(db_categoria)
    session.commit()
    session.refresh(db_categoria)
    return db_categoria

def update(session: Session, categoria_id: int, data: CategoriaCreate):
    db_categoria = get_by_id(session, categoria_id)
    datos = data.model_dump(exclude_unset=True)
    db_categoria.sqlmodel_update(datos)
    session.add(db_categoria)
    session.commit()
    session.refresh(db_categoria)
    return db_categoria

def delete(session: Session, categoria_id: int):
    db_categoria = get_by_id(session, categoria_id)
    session.delete(db_categoria)
    session.commit()