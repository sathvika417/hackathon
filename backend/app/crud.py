from datetime import datetime

from sqlalchemy import Select, select
from sqlalchemy.orm import Session

from app import models, schemas


def get_user_by_email(db: Session, email: str) -> models.User | None:
    stmt: Select[tuple[models.User]] = select(models.User).where(models.User.email == email.lower())
    return db.scalar(stmt)


def create_user(db: Session, payload: schemas.UserCreate, password_hash: str) -> models.User:
    user = models.User(
        full_name=payload.full_name.strip(),
        email=payload.email.lower(),
        password_hash=password_hash,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def create_assessment(db: Session, user_id: int, prediction: schemas.PredictResponse) -> models.Assessment:
    assessment = models.Assessment(
        user_id=user_id,
        occupation=prediction.occupation,
        automation_probability=prediction.automation_probability,
        risk_level=prediction.risk_level,
        communication_score=prediction.communication_score,
        leadership_score=prediction.leadership_score,
        creativity_score=prediction.creativity_score,
        technical_score=prediction.technical_score,
        learning_score=prediction.learning_score,
        business_score=prediction.business_score,
        analytical_score=prediction.analytical_score,
        ai_exposure_score=prediction.ai_exposure_score,
        career_summary=prediction.career_summary,
    )
    db.add(assessment)
    db.commit()
    db.refresh(assessment)
    return assessment


def list_assessments(db: Session, user_id: int) -> list[models.Assessment]:
    stmt = (
        select(models.Assessment)
        .where(models.Assessment.user_id == user_id)
        .order_by(models.Assessment.created_at.desc())
    )
    return list(db.scalars(stmt).all())


def create_saved_occupation(db: Session, user_id: int, occupation: str) -> models.SavedOccupation:
    saved = models.SavedOccupation(user_id=user_id, occupation=occupation)
    db.add(saved)
    db.commit()
    db.refresh(saved)
    return saved


def get_saved_occupation(db: Session, user_id: int, occupation: str) -> models.SavedOccupation | None:
    stmt = select(models.SavedOccupation).where(
        models.SavedOccupation.user_id == user_id,
        models.SavedOccupation.occupation == occupation,
    )
    return db.scalar(stmt)


def list_saved_occupations(db: Session, user_id: int) -> list[models.SavedOccupation]:
    stmt = (
        select(models.SavedOccupation)
        .where(models.SavedOccupation.user_id == user_id)
        .order_by(models.SavedOccupation.created_at.desc())
    )
    return list(db.scalars(stmt).all())


def delete_saved_occupation(db: Session, saved: models.SavedOccupation) -> None:
    db.delete(saved)
    db.commit()


def revoke_token(db: Session, jti: str, token_type: str, expires_at: datetime) -> models.RevokedToken:
    revoked = models.RevokedToken(jti=jti, token_type=token_type, expires_at=expires_at)
    db.add(revoked)
    db.commit()
    db.refresh(revoked)
    return revoked


def is_token_revoked(db: Session, jti: str) -> bool:
    stmt = select(models.RevokedToken).where(models.RevokedToken.jti == jti)
    return db.scalar(stmt) is not None
