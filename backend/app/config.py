from functools import lru_cache
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


BASE_DIR = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    app_name: str = "FutureProof AI"
    app_env: str = "development"
    debug: bool = False
    api_v1_prefix: str = "/api"

    db_host: str = "localhost"
    db_port: int = 3306
    db_name: str = "futureproof_ai"
    db_user: str = "root"
    db_password: str = ""

    jwt_secret: str = "change-me"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24
    reset_token_expire_minutes: int = 30

    google_client_id: str | None = None
    google_client_secret: str | None = None
    google_redirect_uri: str | None = None

    cors_origins_raw: str = Field(
        default="http://localhost:3000,http://127.0.0.1:3000",
        alias="CORS_ORIGINS",
    )

    model_path: Path = BASE_DIR / "models" / "best_catboost_model.pkl"
    imputer_path: Path = BASE_DIR / "models" / "imputer.pkl"
    selected_features_path: Path = BASE_DIR / "models" / "selected_features.pkl"
    dataset_path: Path = BASE_DIR / "data" / "final_dataset.csv"

    model_config = SettingsConfigDict(
        env_file=BASE_DIR / ".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    @property
    def database_url(self) -> str:
        return (
            f"mysql+pymysql://{self.db_user}:{self.db_password}"
            f"@{self.db_host}:{self.db_port}/{self.db_name}"
        )

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins_raw.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
