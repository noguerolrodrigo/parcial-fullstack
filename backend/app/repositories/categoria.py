# app/repositories/categoria.py
from sqlmodel import Session
from app.repositories.base import BaseRepository
from app.models.categoria import Categoria

class CategoriaRepository(BaseRepository[Categoria]):
    def __init__(self, session: Session):
        super().__init__(session, Categoria)