from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr


class UserCreate(BaseModel):
	username: str
	email: EmailStr
	password: str


class UserResponse(BaseModel):
	id: int
	username: str
	email: str
	created_at: datetime

	model_config = ConfigDict(from_attributes=True)

class TagResponse(BaseModel):
	id: int
	name: str

	model_config = ConfigDict(from_attributes=True)

class CommentCreate(BaseModel):
	content: str


class CommentResponse(BaseModel):
	id: int
	content: str
	created_at: datetime
	user_id: int
	idea_id: int

	model_config = ConfigDict(from_attributes=True)


class IdeaCreate(BaseModel):
	title: str
	description: str
	is_public: bool = False
	tags: list[str] = []


class IdeaResponse(BaseModel):
	id: int
	title: str
	description: str
	is_public: bool
	tags: list[TagResponse]
	likes_count: int = 0
	comments: list[CommentResponse] = []
	parent_idea_id: int | None = None
	created_at: datetime
	owner_id: int

	model_config = ConfigDict(from_attributes=True)

class UserLogin(BaseModel):
	email: str
	password: str


class Token(BaseModel):
	access_token: str
	token_type: str

class BookmarkResponse(BaseModel):
	id: int
	user_id: int
	idea_id: int

	model_config = ConfigDict(from_attributes=True)