from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.auth import get_current_user_optional
from app.database import get_db
from app.predict import predictor


router = APIRouter()


@router.post("/predict", response_model=schemas.PredictResponse)
def predict_occupation(
    payload: schemas.PredictRequest,
    db: Session = Depends(get_db),
    current_user: models.User | None = Depends(get_current_user_optional),
):
    try:
        prediction = predictor.predict(payload.occupation)

        if current_user:
            crud.create_assessment(db, current_user.id, prediction)

        return prediction

    except Exception as e:
        import traceback
        traceback.print_exc()      # <-- prints full traceback in terminal
        raise
