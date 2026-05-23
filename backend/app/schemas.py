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


class IdeaCreate(BaseModel):
	title: str
	description: str
	is_public: bool = False


class IdeaResponse(BaseModel):
	id: int
	title: str
	description: str
	is_public: bool
	created_at: datetime
	owner_id: int

	model_config = ConfigDict(from_attributes=True)

class UserLogin(BaseModel):
	email: str
	password: str


class Token(BaseModel):
	access_token: str
	token_type: str