from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload, selectinload
from sqlalchemy import or_, func
from ..auth import get_current_user
from ..database import get_db
from ..models import (Idea, User, Tag, Like, Comment, Bookmark, Notification, Follow, AIReview)
from ..schemas import (IdeaCreate, IdeaResponse, CommentCreate, CommentResponse, BookmarkResponse, TagResponse, IdeaRemixTreeResponse, AIReviewResponse)
from ..services.ai_service import generate_idea_review


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
		status=idea.status,
	)

	seen_tags = set()
	normalized_tag_names = []
	for t in idea.tags:
		trimmed = t.strip()
		if trimmed and trimmed.lower() not in seen_tags:
			seen_tags.add(trimmed.lower())
			normalized_tag_names.append(trimmed)

	for tag_name in normalized_tag_names:
		tag = (
			db.query(Tag)
			.filter(func.lower(Tag.name) == func.lower(tag_name))
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
	# [EAGER LOADING] Added joinedload/selectinload to load owner, tags, likes, and comments with users in bulk
	ideas = (
		db.query(Idea)
		.options(
			joinedload(Idea.owner),
			selectinload(Idea.tags),
			selectinload(Idea.likes),
			selectinload(Idea.comments).joinedload(Comment.user)
		)
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
	# [EAGER LOADING] Eagerly load all relationships for single idea lookup to avoid lazy loading queries
	idea = (
		db.query(Idea)
		.options(
			joinedload(Idea.owner),
			selectinload(Idea.tags),
			selectinload(Idea.likes),
			selectinload(Idea.comments).joinedload(Comment.user)
		)
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
	idea.status = updated_idea.status

	# Update tags
	idea.tags.clear()
	seen_tags = set()
	normalized_tag_names = []
	for t in updated_idea.tags:
		trimmed = t.strip()
		if trimmed and trimmed.lower() not in seen_tags:
			seen_tags.add(trimmed.lower())
			normalized_tag_names.append(trimmed)

	for tag_name in normalized_tag_names:
		tag = (
			db.query(Tag)
			.filter(func.lower(Tag.name) == func.lower(tag_name))
			.first()
		)

		if not tag:
			tag = Tag(name=tag_name)
			db.add(tag)
			db.flush()

		idea.tags.append(tag)

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
	page: int = 1,
	limit: int = 5,
	db: Session = Depends(get_db),
):
	skip = (page - 1) * limit

	# [EAGER LOADING] Eagerly load relationships to resolve N+1 queries when loading the public feed list
	public_ideas = (
		db.query(Idea)
		.options(
			joinedload(Idea.owner),
			selectinload(Idea.tags),
			selectinload(Idea.likes),
			selectinload(Idea.comments).joinedload(Comment.user)
		)
		.filter(Idea.is_public == True)
		.order_by(Idea.created_at.desc())
		.offset(skip)
		.limit(limit)
		.all()
	)

	return public_ideas

@router.get("/search/{tag_name}", response_model=list[IdeaResponse])
def search_by_tag(
	tag_name: str,
	db: Session = Depends(get_db),
):
	# [EAGER LOADING] Eagerly load relationships to optimize search by tag results
	ideas = (
		db.query(Idea)
		.options(
			joinedload(Idea.owner),
			selectinload(Idea.tags),
			selectinload(Idea.likes),
			selectinload(Idea.comments).joinedload(Comment.user)
		)
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
		is_public=True,
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
	# [EAGER LOADING] Load owner, tags, likes, and comments for bookmarked ideas list
	bookmarks = (
		db.query(Idea)
		.options(
			joinedload(Idea.owner),
			selectinload(Idea.tags),
			selectinload(Idea.likes),
			selectinload(Idea.comments).joinedload(Comment.user)
		)
		.join(Bookmark)
		.filter(
			Bookmark.user_id == current_user.id
		)
		.all()
	)

	return bookmarks


@router.get(
	"/following-feed",
	response_model=list[IdeaResponse]
)
def get_following_feed(
	current_user: User = Depends(get_current_user),
	db: Session = Depends(get_db),
):
	followed_users = (
		db.query(Follow.following_id)
		.filter(
			Follow.follower_id == current_user.id
		)
	)

	# [EAGER LOADING] Eagerly load relationships to build following feed with minimum queries
	ideas = (
		db.query(Idea)
		.options(
			joinedload(Idea.owner),
			selectinload(Idea.tags),
			selectinload(Idea.likes),
			selectinload(Idea.comments).joinedload(Comment.user)
		)
		.filter(
			Idea.owner_id.in_(followed_users),
			Idea.is_public == True
		)
		.order_by(Idea.created_at.desc())
		.all()
	)

	return ideas

@router.get(
	"/trending",
	response_model=list[IdeaResponse]
)
def get_trending_ideas(
	db: Session = Depends(get_db),
):
	# [EAGER LOADING] Eagerly load owner, tags, likes, and comments to prevent N+1 query loops when calculating trending scores
	ideas = (
		db.query(Idea)
		.options(
			joinedload(Idea.owner),
			selectinload(Idea.tags),
			selectinload(Idea.likes),
			selectinload(Idea.comments).joinedload(Comment.user)
		)
		.filter(Idea.is_public == True)
		.all()
	)

	sorted_ideas = sorted(
		ideas,
		key=lambda idea:
			(len(idea.likes) * 2)
			+
			len(idea.comments),
		reverse=True
	)

	return sorted_ideas[:10]

@router.get(
    "/public/ideas/{idea_id}",
    response_model=IdeaResponse
)
def get_public_idea(
    idea_id: int,
    db: Session = Depends(get_db),
):

	# [EAGER LOADING] Eagerly load all relationships for public single idea query
    idea = (
        db.query(Idea)
        .options(
            joinedload(Idea.owner),
            selectinload(Idea.tags),
            selectinload(Idea.likes),
            selectinload(Idea.comments).joinedload(Comment.user)
        )
        .filter(
            Idea.id == idea_id,
            Idea.is_public == True
        )
        .first()
    )

    if idea is None:
        raise HTTPException(
            status_code=404,
            detail="Idea not found"
        )
	
    # db.refresh(idea) is removed as it wipes the eagerly loaded cache

    return idea

@router.get("/search", response_model=list[IdeaResponse])
def search_ideas(
    query: str,
    db: Session = Depends(get_db)
):

	# [EAGER LOADING] Load owner, tags, likes, and comments for general query search results
    ideas = (
        db.query(Idea)
        .options(
            joinedload(Idea.owner),
            selectinload(Idea.tags),
            selectinload(Idea.likes),
            selectinload(Idea.comments).joinedload(Comment.user)
        )
        .filter(
            Idea.is_public == True,
            or_(
                Idea.title.ilike(f"%{query}%"),
                Idea.description.ilike(f"%{query}%")
            )
        )
        .all()
    )

    return ideas

@router.get("/tags", response_model=list[TagResponse])
def get_tags(db: Session = Depends(get_db)):
    tags = db.query(Tag).all()
    return tags

@router.get("/ideas/tag/{tag_name}", response_model=list[IdeaResponse])
def get_ideas_by_tag(tag_name: str, db: Session = Depends(get_db)):
	# [EAGER LOADING] Load owner, tags, likes, and comments for tag discovery query results
    ideas = (
        db.query(Idea)
        .options(
            joinedload(Idea.owner),
            selectinload(Idea.tags),
            selectinload(Idea.likes),
            selectinload(Idea.comments).joinedload(Comment.user)
        )
        .join(Idea.tags)
        .filter(
            func.lower(Tag.name) == func.lower(tag_name),
            Idea.is_public == True
        )
        .all()
    )
    return ideas

@router.get("/ideas/{idea_id}/remix-tree", response_model=IdeaRemixTreeResponse)
def get_idea_remix_tree(
	idea_id: int,
	db: Session = Depends(get_db),
):
	root_idea = (
		db.query(Idea)
		.filter(Idea.id == idea_id, Idea.is_public == True)
		.first()
	)

	if root_idea is None:
		raise HTTPException(
			status_code=status.HTTP_404_NOT_FOUND,
			detail="Idea not found",
		)

	visited = set()

	def build_tree(idea: Idea) -> IdeaRemixTreeResponse:
		visited.add(idea.id)
		
		child_ideas = (
			db.query(Idea)
			.filter(
				Idea.parent_idea_id == idea.id,
				Idea.is_public == True
			)
			.order_by(Idea.id.asc())
			.all()
		)
		
		children_list = []
		for child in child_ideas:
			if child.id not in visited:
				children_list.append(build_tree(child))
				
		return IdeaRemixTreeResponse(
			id=idea.id,
			title=idea.title,
			children=children_list
		)

	return build_tree(root_idea)


@router.post(
	"/ideas/{idea_id}/ai-review",
	response_model=AIReviewResponse,
	status_code=status.HTTP_201_CREATED
)
async def generate_ai_review(
	idea_id: int,
	current_user: User = Depends(get_current_user),
	db: Session = Depends(get_db),
):
	idea = (
		db.query(Idea)
		.filter(
			Idea.id == idea_id,
			Idea.owner_id == current_user.id
		)
		.first()
	)

	if idea is None:
		raise HTTPException(
			status_code=status.HTTP_404_NOT_FOUND,
			detail="Idea not found"
		)

	# Generate review using AI service (calls Groq API)
	try:
		review_text = await generate_idea_review(idea.title, idea.description)
	except ValueError as e:
		raise HTTPException(
			status_code=status.HTTP_400_BAD_REQUEST,
			detail=str(e)
		)
	except Exception as e:
		raise HTTPException(
			status_code=status.HTTP_502_BAD_GATEWAY,
			detail=str(e)
		)

	new_review = AIReview(
		idea_id=idea_id,
		review_text=review_text
	)

	db.add(new_review)
	db.commit()
	db.refresh(new_review)

	return new_review


@router.get(
	"/ideas/{idea_id}/ai-review",
	response_model=AIReviewResponse
)
def get_ai_review(
	idea_id: int,
	current_user: User = Depends(get_current_user),
	db: Session = Depends(get_db),
):
	idea = (
		db.query(Idea)
		.filter(
			Idea.id == idea_id,
			Idea.owner_id == current_user.id
		)
		.first()
	)

	if idea is None:
		raise HTTPException(
			status_code=status.HTTP_404_NOT_FOUND,
			detail="Idea not found"
		)

	review = (
		db.query(AIReview)
		.filter(AIReview.idea_id == idea_id)
		.order_by(AIReview.created_at.desc())
		.first()
	)

	if review is None:
		raise HTTPException(
			status_code=status.HTTP_404_NOT_FOUND,
			detail="No AI review found for this idea"
		)

	return review