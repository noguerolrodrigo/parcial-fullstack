from fastapi import APIRouter, Depends
from typing import Annotated, List
from app.database import get_uow
from app.uow import UnitOfWork
from app.schemas.producto import ProductoCreate, ProductoRead
from app.services import producto_service

router = APIRouter(prefix="/productos", tags=["Productos"])

# Repetimos la magia del UoW
UowDep = Annotated[UnitOfWork, Depends(get_uow)]

@router.get("/", response_model=List[ProductoRead])
def listar_productos(uow: UowDep, offset: int = 0, limit: int = 10):
    return producto_service.get_all(uow, offset, limit)

@router.get("/{producto_id}", response_model=ProductoRead)
def obtener_producto(producto_id: int, uow: UowDep):
    return producto_service.get_by_id(uow, producto_id)

@router.post("/", response_model=ProductoRead, status_code=201)
def crear_producto(producto: ProductoCreate, uow: UowDep):
    return producto_service.create(uow, producto)

@router.put("/{producto_id}", response_model=ProductoRead)
def actualizar_producto(producto_id: int, producto: ProductoCreate, uow: UowDep):
    return producto_service.update(uow, producto_id, producto)

@router.delete("/{producto_id}", status_code=204)
def eliminar_producto(producto_id: int, uow: UowDep):
    producto_service.delete(uow, producto_id)