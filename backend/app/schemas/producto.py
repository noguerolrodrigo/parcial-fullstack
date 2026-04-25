from sqlmodel import SQLModel
from typing import Optional, List

class ProductoCreate(SQLModel):
    nombre: str
    precio: float
    descripcion: Optional[str] = None
    categoria_id: Optional[int] = None
    # Esta es la lista que manda tu React (ej: [1, 3])
    ingrediente_ids: List[int] = []

class ProductoRead(SQLModel):
    id: int
    nombre: str
    precio: float
    descripcion: Optional[str] = None
    categoria_id: Optional[int] = None