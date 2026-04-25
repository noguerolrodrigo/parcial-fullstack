from fastapi import APIRouter, Depends
from sqlmodel import Session
from typing import Annotated, List
from app.database import get_session
from app.schemas.ingrediente import IngredienteCreate, IngredienteRead
from app.services import ingrediente_service

router = APIRouter(prefix="/ingredientes", tags=["ingredientes"])
SessionDep = Annotated[Session, Depends(get_session)]

@router.get("/", response_model=List[IngredienteRead])
def listar_ingredientes(session: SessionDep, offset: int = 0, limit: int = 10):
    return ingrediente_service.get_all(session, offset, limit)

@router.get("/{ingrediente_id}", response_model=IngredienteRead)
def obtener_ingrediente(ingrediente_id: int, session: SessionDep):
    return ingrediente_service.get_by_id(session, ingrediente_id)

@router.post("/", response_model=IngredienteRead, status_code=201)
def crear_ingrediente(ingrediente: IngredienteCreate, session: SessionDep):
    return ingrediente_service.create(session, ingrediente)

@router.put("/{ingrediente_id}", response_model=IngredienteRead)
def actualizar_ingrediente(ingrediente_id: int, ingrediente: IngredienteCreate, session: SessionDep):
    return ingrediente_service.update(session, ingrediente_id, ingrediente)

@router.delete("/{ingrediente_id}", status_code=204)
def eliminar_ingrediente(ingrediente_id: int, session: SessionDep):
    ingrediente_service.delete(session, ingrediente_id)