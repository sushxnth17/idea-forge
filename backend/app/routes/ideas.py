from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..auth import oauth2_scheme, verify_access_token
from ..database import get_db
from ..models import Idea, User
from ..schemas import IdeaCreate, IdeaResponse


router = APIRouter()


@router.post("/ideas", response_model=IdeaResponse, status_code=status.HTTP_201_CREATED)
def create_idea(
	idea: IdeaCreate,
	token: str = Depends(oauth2_scheme),
	db: Session = Depends(get_db),
):
	email = verify_access_token(token)
	current_user = db.query(User).filter(User.email == email).first()

	if current_user is None:
		raise HTTPException(
			status_code=status.HTTP_401_UNAUTHORIZED,
			detail="User not found",
		)

	new_idea = Idea(
		title=idea.title,
		description=idea.description,
		owner_id=current_user.id,
	)

	db.add(new_idea)
	db.commit()
	db.refresh(new_idea)

	return new_idea
