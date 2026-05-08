from fastapi import APIRouter, Depends
from typing import Annotated, List
from app.database import get_uow
from app.uow import UnitOfWork
from app.schemas.ingrediente import IngredienteCreate, IngredienteRead
from app.services import ingrediente_service

router = APIRouter(prefix="/ingredientes", tags=["Ingredientes"])

# La misma dependencia inyectable que usamos en categorías
UowDep = Annotated[UnitOfWork, Depends(get_uow)]

@router.get("/", response_model=List[IngredienteRead])
def listar_ingredientes(uow: UowDep, offset: int = 0, limit: int = 10):
    return ingrediente_service.get_all(uow, offset, limit)

@router.get("/{ingrediente_id}", response_model=IngredienteRead)
def obtener_ingrediente(ingrediente_id: int, uow: UowDep):
    return ingrediente_service.get_by_id(uow, ingrediente_id)

@router.post("/", response_model=IngredienteRead, status_code=201)
def crear_ingrediente(ingrediente: IngredienteCreate, uow: UowDep):
    return ingrediente_service.create(uow, ingrediente)

@router.put("/{ingrediente_id}", response_model=IngredienteRead)
def actualizar_ingrediente(ingrediente_id: int, ingrediente: IngredienteCreate, uow: UowDep):
    return ingrediente_service.update(uow, ingrediente_id, ingrediente)

@router.delete("/{ingrediente_id}", status_code=204)
def eliminar_ingrediente(ingrediente_id: int, uow: UowDep):
    ingrediente_service.delete(uow, ingrediente_id)