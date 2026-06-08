from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine
from . import models
from .routes.users import router as users_router
from .routes.ideas import router as ideas_router


app = FastAPI()
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(users_router, prefix="/users", tags=["Users"])
app.include_router(ideas_router, tags=["Ideas"])


@app.on_event("startup")
def create_tables() -> None:
	Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
	return {"message": "IdeaForge Backend Running"}
