from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from ..database import get_db
from ..models import User
from ..schemas import (UserCreate,UserResponse,UserLogin,Token,UserProfileUpdate)
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