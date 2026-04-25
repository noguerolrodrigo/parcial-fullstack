from typing import Optional, List, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship

if TYPE_CHECKING:
    from .producto import ProductoIngrediente

class Ingrediente(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(min_length=2, max_length=100)
    unidad: str = Field(min_length=1, max_length=20)

    producto_links: List["ProductoIngrediente"] = Relationship(back_populates="ingrediente")

class IngredienteCreate(SQLModel):
    nombre: str = Field(min_length=2, max_length=100)
    unidad: str = Field(min_length=1, max_length=20)

class IngredienteRead(SQLModel):
    id: int
    nombre: str
    unidad: str