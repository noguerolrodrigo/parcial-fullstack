from typing import Optional, List, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship

if TYPE_CHECKING:
    from .producto import Producto

class Categoria(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(min_length=2, max_length=50)
    descripcion: Optional[str] = Field(default=None, max_length=200)
    
    # 1. Agregamos la clave foránea que apunta a su propia tabla
    parent_id: Optional[int] = Field(default=None, foreign_key="categoria.id")
    
    # 2. Creamos las relaciones reflexivas (Padre e Hijos/Subcategorías)
    parent: Optional["Categoria"] = Relationship(
        back_populates="subcategorias",
        sa_relationship_kwargs={"remote_side": "Categoria.id"}
    )
    subcategorias: List["Categoria"] = Relationship(back_populates="parent")
    
    # La relación normal que ya tenías con los productos
    productos: List["Producto"] = Relationship(back_populates="categoria")
