from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.auth import get_current_user
from app.database import get_db
from app.predict import predictor


router = APIRouter()


@router.get("/profile/me", response_model=schemas.UserResponse)
def get_profile(current_user: models.User = Depends(get_current_user)) -> schemas.UserResponse:
    return current_user


@router.get("/profile/assessments", response_model=list[schemas.AssessmentResponse])
def get_assessments(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
) -> list[schemas.AssessmentResponse]:
    return crud.list_assessments(db, current_user.id)


@router.get("/profile/saved-occupations", response_model=list[schemas.SavedOccupationResponse])
def get_saved_occupations(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
) -> list[schemas.SavedOccupationResponse]:
    return crud.list_saved_occupations(db, current_user.id)


@router.post(
    "/profile/saved-occupations",
    response_model=schemas.SavedOccupationResponse,
    status_code=status.HTTP_201_CREATED,
)
def save_occupation(
    payload: schemas.SavedOccupationCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
) -> schemas.SavedOccupationResponse:
    predictor.get_occupation(payload.occupation)
    existing = crud.get_saved_occupation(db, current_user.id, payload.occupation)
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Occupation already saved.")
    try:
        return crud.create_saved_occupation(db, current_user.id, payload.occupation)
    except IntegrityError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Occupation already saved.") from exc


@router.delete("/profile/saved-occupations/{occupation_name}", response_model=schemas.MessageResponse)
def delete_saved_occupation(
    occupation_name: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
) -> schemas.MessageResponse:
    saved = crud.get_saved_occupation(db, current_user.id, occupation_name)
    if not saved:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Saved occupation not found.")
    crud.delete_saved_occupation(db, saved)
    return schemas.MessageResponse(message="Saved occupation removed.")
