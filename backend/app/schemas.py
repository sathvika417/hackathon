from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class HealthResponse(BaseModel):
    status: str
    service: str


class MessageResponse(BaseModel):
    message: str


class UserCreate(BaseModel):
    full_name: str = Field(min_length=2, max_length=255)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    full_name: str
    email: EmailStr
    google_id: str | None = None
    created_at: datetime
    updated_at: datetime


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ForgotPasswordResponse(BaseModel):
    message: str
    reset_token: str | None = None


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(min_length=8, max_length=128)


class GoogleConfigResponse(BaseModel):
    enabled: bool
    client_id: str | None = None
    redirect_uri: str | None = None


class OccupationListItem(BaseModel):
    title: str
    description: str
    job_zone: float | None = None
    soc_code: str | None = None


class OccupationDetail(OccupationListItem):
    communication_score: float
    leadership_score: float
    creativity_score: float
    technical_score: float
    learning_score: float
    business_score: float
    analytical_score: float
    ai_exposure_score: float
    baseline_probability: float


class PredictRequest(BaseModel):
    occupation: str = Field(min_length=2, max_length=255)


class PredictResponse(BaseModel):
    occupation: str
    automation_probability: float
    risk_level: str
    communication_score: float
    leadership_score: float
    creativity_score: float
    technical_score: float
    learning_score: float
    business_score: float
    analytical_score: float
    ai_exposure_score: float
    recommended_skills: list[str]
    career_summary: str


class AssessmentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    occupation: str
    automation_probability: float
    risk_level: str
    communication_score: float
    leadership_score: float
    creativity_score: float
    technical_score: float
    learning_score: float
    business_score: float
    analytical_score: float
    ai_exposure_score: float
    career_summary: str
    created_at: datetime


class SavedOccupationCreate(BaseModel):
    occupation: str = Field(min_length=2, max_length=255)


class SavedOccupationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    occupation: str
    created_at: datetime
