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
	bio: str | None = None
	profile_picture: str | None = None
	created_at: datetime

	model_config = ConfigDict(from_attributes=True)


class IdeaOwnerResponse(BaseModel):
	id: int
	username: str
	profile_picture: str | None = None

	model_config = ConfigDict(from_attributes=True)


class CommentUserResponse(BaseModel):
	id: int
	username: str
	profile_picture: str | None = None

	model_config = ConfigDict(from_attributes=True)


class UserSearchResponse(BaseModel):
	id: int
	username: str
	email: str
	bio: str | None = None
	profile_picture: str | None = None
	created_at: datetime
	followers_count: int = 0

	model_config = ConfigDict(from_attributes=True)


class UserProfileUpdate(BaseModel):
	bio: str | None = None
	profile_picture: str | None = None


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
	user: CommentUserResponse | None = None

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
	owner: IdeaOwnerResponse | None = None

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

class NotificationResponse(BaseModel):
	id: int
	message: str
	is_read: bool
	created_at: datetime

	model_config = ConfigDict(from_attributes=True)

class FollowResponse(BaseModel):
	id: int
	follower_id: int
	following_id: int

	model_config = ConfigDict(from_attributes=True)


class PublicUserProfileResponse(BaseModel):
	id: int
	username: str
	bio: str | None = None
	profile_picture: str | None = None
	created_at: datetime
	followers_count: int
	following_count: int
	ideas_count: int
	is_following: bool

	model_config = ConfigDict(from_attributes=True)