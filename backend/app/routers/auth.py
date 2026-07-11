from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.auth import (
    authenticate_user,
    create_access_token,
    create_reset_token,
    decode_token,
    get_current_user,
    hash_password,
    oauth2_scheme,
)
from app.config import get_settings
from app.database import get_db


router = APIRouter()
settings = get_settings()


@router.post("/auth/signup", response_model=schemas.TokenResponse, status_code=status.HTTP_201_CREATED)
def sign_up(payload: schemas.UserCreate, db: Session = Depends(get_db)) -> schemas.TokenResponse:
    existing_user = crud.get_user_by_email(db, payload.email)
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered.")

    user = crud.create_user(db, payload, hash_password(payload.password))
    token = create_access_token(user.id)
    return schemas.TokenResponse(access_token=token, user=user)


@router.post("/auth/login", response_model=schemas.TokenResponse)
def login(payload: schemas.UserLogin, db: Session = Depends(get_db)) -> schemas.TokenResponse:
    user = authenticate_user(db, payload.email, payload.password)
    token = create_access_token(user.id)
    return schemas.TokenResponse(access_token=token, user=user)


@router.post("/auth/logout", response_model=schemas.MessageResponse)
def logout(
    current_user: models.User = Depends(get_current_user),
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> schemas.MessageResponse:
    payload = decode_token(token)
    crud.revoke_token(
        db=db,
        jti=payload["jti"],
        token_type=payload["type"],
        expires_at=datetime.fromtimestamp(payload["exp"], tz=timezone.utc),
    )
    return schemas.MessageResponse(message=f"Logged out {current_user.email} successfully.")


@router.post("/auth/forgot-password", response_model=schemas.ForgotPasswordResponse)
def forgot_password(
    payload: schemas.ForgotPasswordRequest,
    db: Session = Depends(get_db),
) -> schemas.ForgotPasswordResponse:
    user = crud.get_user_by_email(db, payload.email)
    if not user:
        return schemas.ForgotPasswordResponse(
            message="If an account exists for this email, a reset token has been generated."
        )

    reset_token = create_reset_token(user.id)
    return schemas.ForgotPasswordResponse(
        message="Reset token generated successfully.",
        reset_token=reset_token,
    )


@router.post("/auth/reset-password", response_model=schemas.MessageResponse)
def reset_password(
    payload: schemas.ResetPasswordRequest,
    db: Session = Depends(get_db),
) -> schemas.MessageResponse:
    token_payload = decode_token(payload.token)
    if token_payload.get("type") != "reset":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid reset token.")

    user = db.get(models.User, int(token_payload["sub"]))
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    user.password_hash = hash_password(payload.new_password)
    db.add(user)
    db.commit()
    return schemas.MessageResponse(message="Password reset successfully.")


@router.get("/auth/google/config", response_model=schemas.GoogleConfigResponse)
def google_config() -> schemas.GoogleConfigResponse:
    return schemas.GoogleConfigResponse(
        enabled=bool(settings.google_client_id and settings.google_client_secret),
        client_id=settings.google_client_id,
        redirect_uri=settings.google_redirect_uri,
    )
