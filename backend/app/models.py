from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
	__tablename__ = "users"

	id = Column(Integer, primary_key=True, index=True)
	username = Column(String, unique=True, index=True, nullable=False)
	email = Column(String, unique=True, index=True, nullable=False)
	hashed_password = Column(String, nullable=False)
	created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
	ideas = relationship("Idea", back_populates="owner", cascade="all, delete-orphan")


class Idea(Base):
	__tablename__ = "ideas"

	id = Column(Integer, primary_key=True, index=True)
	title = Column(String, nullable=False)
	description = Column(Text, nullable=False)
	is_public = Column(Boolean, default=False, nullable=False)
	created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
	owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
	owner = relationship("User", back_populates="ideas")
