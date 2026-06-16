from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from ..database import get_db
from ..models import User, Notification, Follow,Idea
from ..schemas import (UserCreate,UserResponse,UserLogin,Token,UserProfileUpdate,NotificationResponse,FollowResponse,IdeaResponse,UserSearchResponse,PublicUserProfileResponse)
from ..utils import hash_password, verify_password
from ..auth import create_access_token, get_current_user


router = APIRouter()


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
	existing_user = (
		db.query(User)
		.filter((User.username == user.username) | (User.email == user.email))
		.first()
	)

	if existing_user:
		raise HTTPException(
			status_code=status.HTTP_400_BAD_REQUEST,
			detail="Username or email already exists",
		)

	hashed_password = hash_password(user.password)

	new_user = User(
		username=user.username,
		email=user.email,
		hashed_password=hashed_password,
	)

	db.add(new_user)
	db.commit()
	db.refresh(new_user)

	return new_user

@router.post("/login", response_model=Token)
def login_user(
	form_data: OAuth2PasswordRequestForm = Depends(),
	db: Session = Depends(get_db),
):
	existing_user = (
		db.query(User)
		.filter(User.email == form_data.username)
		.first()
	)

	if not existing_user:
		raise HTTPException(
			status_code=status.HTTP_401_UNAUTHORIZED,
			detail="Invalid email or password",
		)

	if not verify_password(form_data.password, existing_user.hashed_password):
		raise HTTPException(
			status_code=status.HTTP_401_UNAUTHORIZED,
			detail="Invalid email or password",
		)

	access_token = create_access_token(
		data={"sub": existing_user.email}
	)

	return {
		"access_token": access_token,
		"token_type": "bearer",
	}

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
	return current_user

@router.get("/profile", response_model=UserResponse)
def get_profile(
	current_user: User = Depends(get_current_user),
):
	return current_user


@router.put("/profile", response_model=UserResponse)
def update_profile(
	profile_data: UserProfileUpdate,
	current_user: User = Depends(get_current_user),
	db: Session = Depends(get_db),
):
	current_user.bio = profile_data.bio
	current_user.profile_picture = profile_data.profile_picture

	db.commit()
	db.refresh(current_user)

	return current_user

@router.get("/search", response_model=list[UserSearchResponse])
def search_users(
	query: str,
	current_user: User = Depends(get_current_user),
	db: Session = Depends(get_db),
):
	users = (
		db.query(User)
		.filter(User.username.ilike(f"%{query}%"))
		.all()
	)
	for u in users:
		u.followers_count = len(u.followers)
	return users

@router.get(
	"/notifications",
	response_model=list[NotificationResponse]
)
def get_notifications(
	current_user: User = Depends(get_current_user),
	db: Session = Depends(get_db),
):
	notifications = (
		db.query(Notification)
		.filter(
			Notification.user_id == current_user.id
		)
		.order_by(
			Notification.created_at.desc()
		)
		.all()
	)

	return notifications


@router.put(
	"/notifications/{notification_id}/read"
)
def mark_notification_read(
	notification_id: int,
	current_user: User = Depends(get_current_user),
	db: Session = Depends(get_db),
):
	notification = (
		db.query(Notification)
		.filter(
			Notification.id == notification_id,
			Notification.user_id == current_user.id
		)
		.first()
	)

	if not notification:
		raise HTTPException(
			status_code=status.HTTP_404_NOT_FOUND,
			detail="Notification not found"
		)

	notification.is_read = True

	db.commit()

	return {
		"message": "Notification marked as read"
	}

@router.post(
	"/follow/{user_id}",
	response_model=FollowResponse,
	status_code=status.HTTP_201_CREATED
)
def follow_user(
	user_id: int,
	current_user: User = Depends(get_current_user),
	db: Session = Depends(get_db),
):
	if current_user.id == user_id:
		raise HTTPException(
			status_code=400,
			detail="You cannot follow yourself"
		)

	user = db.query(User).filter(
		User.id == user_id
	).first()

	if not user:
		raise HTTPException(
			status_code=404,
			detail="User not found"
		)

	existing_follow = db.query(Follow).filter(
		Follow.follower_id == current_user.id,
		Follow.following_id == user_id
	).first()

	if existing_follow:
		raise HTTPException(
			status_code=400,
			detail="Already following"
		)

	new_follow = Follow(
		follower_id=current_user.id,
		following_id=user_id
	)

	db.add(new_follow)

	notification = Notification(
		message=f"{current_user.username} started following you",
		user_id=user_id
	)
	db.add(notification)

	db.commit()
	db.refresh(new_follow)

	return new_follow


@router.get("/followers/{user_id}")
def get_followers(
	user_id: int,
	db: Session = Depends(get_db),
):
	return (
		db.query(Follow)
		.filter(Follow.following_id == user_id)
		.all()
	)


@router.get("/following/{user_id}")
def get_following(
	user_id: int,
	db: Session = Depends(get_db),
):
	return (
		db.query(Follow)
		.filter(Follow.follower_id == user_id)
		.all()
	)

@router.get(
    "/{user_id}/ideas",
    response_model=list[IdeaResponse]
)
def get_user_ideas(
    user_id: int,
    db: Session = Depends(get_db)
):

    ideas = (
        db.query(Idea)
        .filter(
            Idea.owner_id == user_id,
            Idea.is_public == True
        )
        .all()
    )

    return ideas


@router.get("/{user_id}", response_model=PublicUserProfileResponse)
def get_public_profile(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    is_following = db.query(Follow).filter(
        Follow.follower_id == current_user.id,
        Follow.following_id == user_id
    ).first() is not None

    ideas_count = db.query(Idea).filter(
        Idea.owner_id == user_id,
        Idea.is_public == True
    ).count()

    followers_count = db.query(Follow).filter(Follow.following_id == user_id).count()
    following_count = db.query(Follow).filter(Follow.follower_id == user_id).count()

    return {
        "id": user.id,
        "username": user.username,
        "bio": user.bio,
        "profile_picture": user.profile_picture,
        "created_at": user.created_at,
        "followers_count": followers_count,
        "following_count": following_count,
        "ideas_count": ideas_count,
        "is_following": is_following
    }


@router.delete("/follow/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def unfollow_user(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.id == user_id:
        raise HTTPException(
            status_code=400,
            detail="You cannot unfollow yourself"
        )

    follow = db.query(Follow).filter(
        Follow.follower_id == current_user.id,
        Follow.following_id == user_id
    ).first()

    if not follow:
        raise HTTPException(
            status_code=404,
            detail="You are not following this user"
        )

    db.delete(follow)
    db.commit()
    return None