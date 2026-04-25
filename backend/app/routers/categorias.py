from fastapi import APIRouter, Depends
from sqlmodel import Session
from typing import Annotated, List
from app.database import get_session
from app.schemas.categoria import CategoriaCreate, CategoriaRead
from app.services import categoria_service 

router = APIRouter(prefix="/categorias", tags=["categorias"])
SessionDep = Annotated[Session, Depends(get_session)]

@router.get("/", response_model=List[CategoriaRead])
def listar_categorias(session: SessionDep, offset: int = 0, limit: int = 10):
    return categoria_service.get_all(session, offset, limit)

@router.get("/{categoria_id}", response_model=CategoriaRead)
def obtener_categoria(categoria_id: int, session: SessionDep):
    return categoria_service.get_by_id(session, categoria_id)

@router.post("/", response_model=CategoriaRead, status_code=201)
def crear_categoria(categoria: CategoriaCreate, session: SessionDep):
    return categoria_service.create(session, categoria)

@router.put("/{categoria_id}", response_model=CategoriaRead)
def actualizar_categoria(categoria_id: int, categoria: CategoriaCreate, session: SessionDep):
    return categoria_service.update(session, categoria_id, categoria)

@router.delete("/{categoria_id}", status_code=204)
def eliminar_categoria(categoria_id: int, session: SessionDep):
    categoria_service.delete(session, categoria_id)