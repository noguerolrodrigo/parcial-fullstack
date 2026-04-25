from sqlmodel import SQLModel
from typing import Optional

# Lo que recibimos del Front para CREAR una categoría
class CategoriaCreate(SQLModel):
    nombre: str
    descripcion: Optional[str] = None

# Lo que le mandamos al Front para LEER una categoría
class CategoriaRead(SQLModel):
    id: int
    nombre: str
    descripcion: Optional[str] = None