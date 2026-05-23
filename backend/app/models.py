from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text, Table, func
from sqlalchemy.orm import relationship
from .database import Base

idea_tags = Table(
	"idea_tags",
	Base.metadata,
	Column("idea_id", ForeignKey("ideas.id"), primary_key=True),
	Column("tag_id", ForeignKey("tags.id"), primary_key=True),
)


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
	tags = relationship("Tag", secondary=idea_tags, back_populates="ideas")


class Tag(Base):
	__tablename__ = "tags"

	id = Column(Integer, primary_key=True, index=True)
	name = Column(String, unique=True, nullable=False)

	ideas = relationship(
		"Idea",
		secondary=idea_tags,
		back_populates="tags"
	)