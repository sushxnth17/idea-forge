from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User
from ..schemas import UserCreate, UserLogin, UserResponse, Token
from ..utils import hash_password, verify_password
from ..auth import create_access_token


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
def login_user(user: UserLogin, db: Session = Depends(get_db)):
	existing_user = (
		db.query(User)
		.filter(User.email == user.email)
		.first()
	)

	if not existing_user:
		raise HTTPException(
			status_code=status.HTTP_401_UNAUTHORIZED,
			detail="Invalid email or password",
		)

	if not verify_password(user.password, existing_user.hashed_password):
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