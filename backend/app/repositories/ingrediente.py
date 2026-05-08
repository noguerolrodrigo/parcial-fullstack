# app/repositories/ingrediente.py
from sqlmodel import Session
from app.repositories.base import BaseRepository
from app.models.ingrediente import Ingrediente

class IngredienteRepository(BaseRepository[Ingrediente]):
    def __init__(self, session: Session):
        super().__init__(session, Ingrediente)