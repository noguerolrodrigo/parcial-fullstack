from typing import Optional, List, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship

if TYPE_CHECKING:
    from .categoria import Categoria
    from .ingrediente import Ingrediente

class ProductoIngrediente(SQLModel, table=True):
    producto_id: Optional[int] = Field(default=None, foreign_key="producto.id", primary_key=True)
    ingrediente_id: Optional[int] = Field(default=None, foreign_key="ingrediente.id", primary_key=True)
    cantidad: float = Field(default=1.0)

    producto: Optional["Producto"] = Relationship(back_populates="ingrediente_links")
    ingrediente: Optional["Ingrediente"] = Relationship(back_populates="producto_links")

class Producto(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(min_length=2, max_length=100)
    precio: float = Field(gt=0)
    descripcion: Optional[str] = Field(default=None, max_length=300)
    categoria_id: Optional[int] = Field(default=None, foreign_key="categoria.id")

    categoria: Optional["Categoria"] = Relationship(back_populates="productos")
    ingrediente_links: List["ProductoIngrediente"] = Relationship(back_populates="producto")

    @property
    def ingredientes(self):
        return [link.ingrediente for link in self.ingrediente_links if link.ingrediente]

class ProductoCreate(SQLModel):
    nombre: str = Field(min_length=2, max_length=100)
    precio: float = Field(gt=0)
    descripcion: Optional[str] = None
    categoria_id: Optional[int] = None
    ingrediente_ids: List[int] = []

class ProductoRead(SQLModel):
    id: int
    nombre: str
    precio: float
    descripcion: Optional[str] = None
    categoria_id: Optional[int] = None