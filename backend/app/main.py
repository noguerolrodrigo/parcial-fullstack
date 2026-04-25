from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import create_db_and_tables
from app.routers import categorias, ingredientes, productos

app = FastAPI(title="Parcial API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

app.include_router(categorias.router)
app.include_router(ingredientes.router)
app.include_router(productos.router)

@app.get("/")
def root():
    return {"mensaje": "API funcionando"}