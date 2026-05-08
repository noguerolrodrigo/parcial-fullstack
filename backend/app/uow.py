# app/uow.py
from sqlmodel import Session
from app.repositories.categoria import CategoriaRepository
from app.repositories.ingrediente import IngredienteRepository
from app.repositories.producto import ProductoRepository

class UnitOfWork:
    def __init__(self, session: Session):
        self.session = session
        # Asignamos el repositorio específico a cada sector
        self.categorias = CategoriaRepository(session)
        self.ingredientes = IngredienteRepository(session)
        self.productos = ProductoRepository(session)

    def commit(self):
        self.session.commit()

    def rollback(self):
        self.session.rollback()