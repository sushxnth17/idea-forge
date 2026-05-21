from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User
from ..schemas import UserCreate, UserResponse
from ..utils import hash_password


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
