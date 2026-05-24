from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..auth import get_current_user
from ..database import get_db
from ..models import (Idea, User, Tag, Like, Comment,Bookmark,Notification)
from ..schemas import (IdeaCreate,IdeaResponse,CommentCreate,CommentResponse, BookmarkResponse)


router = APIRouter()


@router.post("/ideas", response_model=IdeaResponse, status_code=status.HTTP_201_CREATED)
def create_idea(
	idea: IdeaCreate,
	current_user: User = Depends(get_current_user),
	db: Session = Depends(get_db),
):

	new_idea = Idea(
		title=idea.title,
		description=idea.description,
		is_public=idea.is_public,
		owner_id=current_user.id,
	)

	for tag_name in idea.tags:
		tag = (
			db.query(Tag)
			.filter(Tag.name == tag_name)
			.first()
		)

		if not tag:
			tag = Tag(name=tag_name)
			db.add(tag)
			db.flush()

		new_idea.tags.append(tag)

	db.add(new_idea)
	db.commit()
	db.refresh(new_idea)

	return new_idea

@router.get("/ideas", response_model=list[IdeaResponse])
def get_ideas(
	current_user: User = Depends(get_current_user),
	db: Session = Depends(get_db),
):
	ideas = (
		db.query(Idea)
		.filter(Idea.owner_id == current_user.id)
		.order_by(Idea.created_at.desc())
		.all()
	)

	return ideas

@router.get("/ideas/{idea_id}", response_model=IdeaResponse)
def get_single_idea(
	idea_id: int,
	current_user: User = Depends(get_current_user),
	db: Session = Depends(get_db),
):
	idea = (
		db.query(Idea)
		.filter(
			Idea.id == idea_id,
			Idea.owner_id == current_user.id,
		)
		.first()
	)

	if idea is None:
		raise HTTPException(
			status_code=status.HTTP_404_NOT_FOUND,
			detail="Idea not found",
		)

	return idea

@router.put("/ideas/{idea_id}", response_model=IdeaResponse)
def update_idea(
	idea_id: int,
	updated_idea: IdeaCreate,
	current_user: User = Depends(get_current_user),
	db: Session = Depends(get_db),
):
	idea = (
		db.query(Idea)
		.filter(
			Idea.id == idea_id,
			Idea.owner_id == current_user.id,
		)
		.first()
	)

	if idea is None:
		raise HTTPException(
			status_code=status.HTTP_404_NOT_FOUND,
			detail="Idea not found",
		)

	idea.title = updated_idea.title
	idea.description = updated_idea.description
	idea.is_public = updated_idea.is_public

	db.commit()
	db.refresh(idea)

	return idea

@router.delete("/ideas/{idea_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_idea(
	idea_id: int,
	current_user: User = Depends(get_current_user),
	db: Session = Depends(get_db),
):
	idea = (
		db.query(Idea)
		.filter(
			Idea.id == idea_id,
			Idea.owner_id == current_user.id,
		)
		.first()
	)

	if idea is None:
		raise HTTPException(
			status_code=status.HTTP_404_NOT_FOUND,
			detail="Idea not found",
		)

	db.delete(idea)
	db.commit()

@router.get("/feed", response_model=list[IdeaResponse])
def get_public_feed(
	db: Session = Depends(get_db),
):
	public_ideas = (
		db.query(Idea)
		.filter(Idea.is_public == True)
		.order_by(Idea.created_at.desc())
		.all()
	)

	return public_ideas

@router.get("/search/{tag_name}", response_model=list[IdeaResponse])
def search_by_tag(
	tag_name: str,
	db: Session = Depends(get_db),
):
	ideas = (
		db.query(Idea)
		.join(Idea.tags)
		.filter(
			Tag.name.ilike(tag_name),
			Idea.is_public == True
		)
		.all()
	)

	return ideas

@router.post("/ideas/{idea_id}/like")
def like_idea(
	idea_id: int,
	current_user: User = Depends(get_current_user),
	db: Session = Depends(get_db),
):
	idea = db.query(Idea).filter(
		Idea.id == idea_id,
		Idea.is_public == True
	).first()

	if not idea:
		raise HTTPException(
			status_code=status.HTTP_404_NOT_FOUND,
			detail="Idea not found",
		)

	existing_like = db.query(Like).filter(
		Like.user_id == current_user.id,
		Like.idea_id == idea_id
	).first()

	if existing_like:
		raise HTTPException(
			status_code=status.HTTP_400_BAD_REQUEST,
			detail="Already liked",
		)

	new_like = Like(
	user_id=current_user.id,
	idea_id=idea_id
)

	db.add(new_like)

	# Don't notify yourself
	if current_user.id != idea.owner_id:
		notification = Notification(
			message=f"{current_user.username} liked your idea '{idea.title}'",
			user_id=idea.owner_id
		)

		db.add(notification)
	db.commit()

	return {"message": "Idea liked successfully"}

@router.post(
	"/ideas/{idea_id}/comments",
	response_model=CommentResponse,
	status_code=status.HTTP_201_CREATED
)
def create_comment(
	idea_id: int,
	comment: CommentCreate,
	current_user: User = Depends(get_current_user),
	db: Session = Depends(get_db),
):
	idea = db.query(Idea).filter(
		Idea.id == idea_id
	).first()

	if not idea:
		raise HTTPException(
			status_code=status.HTTP_404_NOT_FOUND,
			detail="Idea not found"
		)

	new_comment = Comment(
		content=comment.content,
		user_id=current_user.id,
		idea_id=idea_id
	)

	db.add(new_comment)
	if current_user.id != idea.owner_id:
		notification = Notification(
			message=f"{current_user.username} commented on your idea '{idea.title}'",
			user_id=idea.owner_id
		)
		db.add(notification)
	db.commit()
	db.refresh(new_comment)

	return new_comment

@router.post(
	"/ideas/{idea_id}/remix",
	response_model=IdeaResponse,
	status_code=status.HTTP_201_CREATED
)
def remix_idea(
	idea_id: int,
	current_user: User = Depends(get_current_user),
	db: Session = Depends(get_db),
):
	original_idea = (
		db.query(Idea)
		.filter(Idea.id == idea_id)
		.first()
	)

	if original_idea is None:
		raise HTTPException(
			status_code=status.HTTP_404_NOT_FOUND,
			detail="Idea not found"
		)

	new_idea = Idea(
		title=f"{original_idea.title} (Remix)",
		description=original_idea.description,
		is_public=False,
		owner_id=current_user.id,
		parent_idea_id=original_idea.id
	)

	new_idea.tags = original_idea.tags.copy()

	db.add(new_idea)

	if current_user.id != original_idea.owner_id:
		notification = Notification(
		message=f"{current_user.username} remixed your idea '{original_idea.title}'",
		user_id=original_idea.owner_id
	)

		db.add(notification)
	db.commit()
	db.refresh(new_idea)

	return new_idea

@router.post(
	"/ideas/{idea_id}/bookmark",
	response_model=BookmarkResponse,
	status_code=status.HTTP_201_CREATED
)
def bookmark_idea(
	idea_id: int,
	current_user: User = Depends(get_current_user),
	db: Session = Depends(get_db),
):
	idea = db.query(Idea).filter(
		Idea.id == idea_id
	).first()

	if not idea:
		raise HTTPException(
			status_code=status.HTTP_404_NOT_FOUND,
			detail="Idea not found"
		)

	existing_bookmark = db.query(Bookmark).filter(
		Bookmark.user_id == current_user.id,
		Bookmark.idea_id == idea_id
	).first()

	if existing_bookmark:
		raise HTTPException(
			status_code=status.HTTP_400_BAD_REQUEST,
			detail="Already bookmarked"
		)

	new_bookmark = Bookmark(
		user_id=current_user.id,
		idea_id=idea_id
	)

	db.add(new_bookmark)
	db.commit()
	db.refresh(new_bookmark)

	return new_bookmark


@router.get(
	"/bookmarks",
	response_model=list[IdeaResponse]
)
def get_bookmarks(
	current_user: User = Depends(get_current_user),
	db: Session = Depends(get_db),
):
	bookmarks = (
		db.query(Idea)
		.join(Bookmark)
		.filter(
			Bookmark.user_id == current_user.id
		)
		.all()
	)

	return bookmarks