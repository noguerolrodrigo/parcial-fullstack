from fastapi import APIRouter, Depends
from typing import Annotated, List
from app.database import get_uow
from app.uow import UnitOfWork
from app.schemas.categoria import CategoriaCreate, CategoriaRead
from app.services import categoria_service

router = APIRouter(prefix="/categorias", tags=["Categorias"])

# ACA ESTA LA CLAVE: Creamos nuestra dependencia inyectable de UoW
UowDep = Annotated[UnitOfWork, Depends(get_uow)]

@router.get("/", response_model=List[CategoriaRead])
def listar_categorias(uow: UowDep, offset: int = 0, limit: int = 10):
    return categoria_service.get_all(uow, offset, limit)

@router.get("/{categoria_id}", response_model=CategoriaRead)
def obtener_categoria(categoria_id: int, uow: UowDep):
    return categoria_service.get_by_id(uow, categoria_id)

@router.post("/", response_model=CategoriaRead, status_code=201)
def crear_categoria(categoria: CategoriaCreate, uow: UowDep):
    return categoria_service.create(uow, categoria)

@router.put("/{categoria_id}", response_model=CategoriaRead)
def actualizar_categoria(categoria_id: int, categoria: CategoriaCreate, uow: UowDep):
    return categoria_service.update(uow, categoria_id, categoria)

@router.delete("/{categoria_id}", status_code=204)
def eliminar_categoria(categoria_id: int, uow: UowDep):
    categoria_service.delete(uow, categoria_id)