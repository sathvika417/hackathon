from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.database import init_db
from app.predict import predictor
from app.routers import auth, occupation, prediction, profile


settings = get_settings()


@asynccontextmanager
async def lifespan(_: FastAPI):
    predictor.load()
    init_db()
    yield


app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api", tags=["auth"])
app.include_router(occupation.router, prefix="/api", tags=["occupations"])
app.include_router(prediction.router, prefix="/api", tags=["prediction"])
app.include_router(profile.router, prefix="/api", tags=["profile"])


@app.get("/", tags=["health"])
def health_check() -> dict[str, str]:
    return {"status": "ok", "service": settings.app_name}
