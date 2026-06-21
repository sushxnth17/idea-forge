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
	bio = Column(Text, nullable=True)
	profile_picture = Column(String,nullable=True)
	created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
	ideas = relationship("Idea", back_populates="owner", cascade="all, delete-orphan")
	likes = relationship("Like", back_populates="user", cascade="all, delete-orphan")
	comments = relationship("Comment",back_populates="user",cascade="all, delete-orphan")
	bookmarks = relationship("Bookmark",back_populates="user",cascade="all, delete-orphan")
	notifications = relationship("Notification",back_populates="user",cascade="all, delete-orphan")
	followers = relationship("Follow",foreign_keys="Follow.following_id",cascade="all, delete-orphan")
	following = relationship("Follow",foreign_keys="Follow.follower_id",cascade="all, delete-orphan")
	collaboration_requests = relationship("CollaborationRequest", back_populates="requester", foreign_keys="CollaborationRequest.requester_id", cascade="all, delete-orphan")


class Idea(Base):
	__tablename__ = "ideas"

	id = Column(Integer, primary_key=True, index=True)
	title = Column(String, nullable=False)
	description = Column(Text, nullable=False)
	is_public = Column(Boolean, default=False, index=True, nullable=False)
	created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True, nullable=False)
	owner_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
	parent_idea_id = Column(Integer,ForeignKey("ideas.id"),index=True,nullable=True)
	status = Column(String, default="concept", nullable=False)
	owner = relationship("User", back_populates="ideas")
	parent_idea = relationship("Idea",remote_side=[id])
	tags = relationship("Tag", secondary=idea_tags, back_populates="ideas")
	likes = relationship("Like", back_populates="idea", cascade="all, delete-orphan")
	comments = relationship("Comment",back_populates="idea",cascade="all, delete-orphan")
	bookmarks = relationship("Bookmark",back_populates="idea",cascade="all, delete-orphan")
	ai_reviews = relationship("AIReview", back_populates="idea", cascade="all, delete-orphan")
	collaboration_requests = relationship("CollaborationRequest", back_populates="idea", cascade="all, delete-orphan")

	@property
	def likes_count(self):
		return len(self.likes)

	@property
	def collaborators(self):
		return [req.requester for req in self.collaboration_requests if req.status == "accepted"]

class Tag(Base):
	__tablename__ = "tags"

	id = Column(Integer, primary_key=True, index=True)
	name = Column(String, unique=True, nullable=False)

	ideas = relationship(
		"Idea",
		secondary=idea_tags,
		back_populates="tags"
	)

class Like(Base):
	__tablename__ = "likes"

	id = Column(Integer, primary_key=True, index=True)

	user_id = Column(
		Integer,
		ForeignKey("users.id"),
		index=True,
		nullable=False
	)

	idea_id = Column(
		Integer,
		ForeignKey("ideas.id"),
		index=True,
		nullable=False
	)

	user = relationship(
		"User",
		back_populates="likes"
	)

	idea = relationship(
		"Idea",
		back_populates="likes"
	)

class Comment(Base):
	__tablename__ = "comments"

	id = Column(Integer, primary_key=True, index=True)

	content = Column(Text, nullable=False)

	created_at = Column(
		DateTime(timezone=True),
		server_default=func.now(),
		nullable=False
	)

	user_id = Column(
		Integer,
		ForeignKey("users.id"),
		index=True,
		nullable=False
	)

	idea_id = Column(
		Integer,
		ForeignKey("ideas.id"),
		index=True,
		nullable=False
	)

	user = relationship(
		"User",
		back_populates="comments"
	)

	idea = relationship(
		"Idea",
		back_populates="comments"
	)

class Bookmark(Base):
	__tablename__ = "bookmarks"

	id = Column(Integer, primary_key=True, index=True)

	user_id = Column(
		Integer,
		ForeignKey("users.id"),
		index=True,
		nullable=False
	)

	idea_id = Column(
		Integer,
		ForeignKey("ideas.id"),
		index=True,
		nullable=False
	)

	user = relationship(
		"User",
		back_populates="bookmarks"
	)

	idea = relationship(
		"Idea",
		back_populates="bookmarks"
	)

class Notification(Base):
	__tablename__ = "notifications"

	id = Column(
		Integer,
		primary_key=True,
		index=True
	)

	message = Column(
		Text,
		nullable=False
	)

	is_read = Column(
		Boolean,
		default=False,
		nullable=False
	)

	created_at = Column(
		DateTime(timezone=True),
		server_default=func.now(),
		nullable=False
	)

	user_id = Column(
		Integer,
		ForeignKey("users.id"),
		index=True,
		nullable=False
	)

	user = relationship(
		"User",
		back_populates="notifications"
	)

class Follow(Base):
	__tablename__ = "follows"

	id = Column(
		Integer,
		primary_key=True,
		index=True
	)

	follower_id = Column(
		Integer,
		ForeignKey("users.id"),
		index=True,
		nullable=False
	)

	following_id = Column(
		Integer,
		ForeignKey("users.id"),
		index=True,
		nullable=False
	)

	follower = relationship(
		"User",
		foreign_keys=[follower_id]
	)

	following = relationship(
		"User",
		foreign_keys=[following_id]
	)


class AIReview(Base):
	__tablename__ = "ai_reviews"

	id = Column(
		Integer,
		primary_key=True,
		index=True
	)

	idea_id = Column(
		Integer,
		ForeignKey("ideas.id"),
		index=True,
		nullable=False
	)

	review_text = Column(
		Text,
		nullable=False
	)

	created_at = Column(
		DateTime(timezone=True),
		server_default=func.now(),
		nullable=False
	)

	idea = relationship(
		"Idea",
		back_populates="ai_reviews"
	)


class CollaborationRequest(Base):
	__tablename__ = "collaboration_requests"

	id = Column(Integer, primary_key=True, index=True)
	idea_id = Column(Integer, ForeignKey("ideas.id"), index=True, nullable=False)
	requester_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
	status = Column(String, default="pending", nullable=False)  # pending, accepted, rejected
	message = Column(Text, nullable=True)
	created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

	idea = relationship("Idea", back_populates="collaboration_requests")
	requester = relationship("User", back_populates="collaboration_requests", foreign_keys=[requester_id])