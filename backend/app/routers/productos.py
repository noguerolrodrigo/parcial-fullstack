from fastapi import APIRouter, Depends
from sqlmodel import Session
from typing import Annotated, List
from app.database import get_session
from app.schemas.producto import ProductoCreate, ProductoRead
from app.services import producto_service

router = APIRouter(prefix="/productos", tags=["productos"])
SessionDep = Annotated[Session, Depends(get_session)]

@router.get("/", response_model=List[ProductoRead])
def listar_productos(session: SessionDep, offset: int = 0, limit: int = 10):
    return producto_service.get_all(session, offset, limit)

@router.get("/{producto_id}", response_model=ProductoRead)
def obtener_producto(producto_id: int, session: SessionDep):
    return producto_service.get_by_id(session, producto_id)

@router.post("/", response_model=ProductoRead, status_code=201)
def crear_producto(producto: ProductoCreate, session: SessionDep):
    return producto_service.create(session, producto)

@router.put("/{producto_id}", response_model=ProductoRead)
def actualizar_producto(producto_id: int, producto: ProductoCreate, session: SessionDep):
    return producto_service.update(session, producto_id, producto)

@router.delete("/{producto_id}", status_code=204)
def eliminar_producto(producto_id: int, session: SessionDep):
    producto_service.delete(session, producto_id)