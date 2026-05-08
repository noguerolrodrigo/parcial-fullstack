# app/repositories/base.py
from sqlmodel import Session, select
from typing import TypeVar, Generic, Type

T = TypeVar("T")

class BaseRepository(Generic[T]):
    def __init__(self, session: Session, model: Type[T]):
        self.session = session
        self.model = model

    def get_all(self, offset: int = 0, limit: int = 10):
        return self.session.exec(select(self.model).offset(offset).limit(limit)).all()

    def get_by_id(self, id: int):
        return self.session.get(self.model, id)

    def add(self, entity: T):
        self.session.add(entity)

    def delete(self, entity: T):
        self.session.delete(entity)