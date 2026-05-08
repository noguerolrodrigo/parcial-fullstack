# app/repositories/producto.py
from sqlmodel import Session
from app.repositories.base import BaseRepository
from app.models.producto import Producto

class ProductoRepository(BaseRepository[Producto]):
    def __init__(self, session: Session):
        super().__init__(session, Producto)