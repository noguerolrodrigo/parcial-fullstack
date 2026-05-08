from sqlmodel import SQLModel, create_engine, Session
from dotenv import load_dotenv
import os
from fastapi import Depends
from app.uow import UnitOfWork

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine) # <-- CREA LAS NUEVAS CON EL PARENT_ID

def get_session():
    with Session(engine) as session:
        yield session

def get_uow(session: Session = Depends(get_session)):
    return UnitOfWork(session)