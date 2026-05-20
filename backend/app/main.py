from fastapi import FastAPI

from .database import Base, engine
from . import models


app = FastAPI()


@app.on_event("startup")
def create_tables() -> None:
	Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
	return {"message": "IdeaForge Backend Running"}
