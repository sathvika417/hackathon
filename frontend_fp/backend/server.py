"""FutureProof AI — FastAPI backend.

Stateless service that serves CatBoost automation-probability predictions along
with derived career insights (skill recommendations, alternatives, AI factor
trend). No database is used; all data comes from the ML model + static catalog.
"""

from __future__ import annotations

import logging
import os
from pathlib import Path
from typing import List

from dotenv import load_dotenv
from fastapi import APIRouter, FastAPI, HTTPException
from pydantic import BaseModel, Field
from starlette.middleware.cors import CORSMiddleware

from ml_model import predictor
from occupations_data import (
    FEATURE_COLUMNS,
    OCCUPATIONS,
    SKILL_CATALOG,
    TOP_AI_FACTORS,
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

app = FastAPI(title="FutureProof AI")
api = APIRouter(prefix="/api")


# ---------------------------------------------------------------------------
# Schemas
# ---------------------------------------------------------------------------
class Occupation(BaseModel):
    id: str
    name: str
    category: str


class PredictRequest(BaseModel):
    occupation_id: str = Field(..., description="Occupation identifier")
    persona: str = Field(..., description="student|professional|freelancer|business_owner|career_switcher")
    experience: str = Field(..., description="0-2|2-5|5-10|10+")
    education: str = Field(..., description="diploma|bachelor|master|phd")
    ai_usage: str = Field(..., description="never|rarely|sometimes|often|daily")


class ScoreCard(BaseModel):
    key: str
    label: str
    value: float
    icon: str


class TrendPoint(BaseModel):
    year: int
    probability: float


class SkillRec(BaseModel):
    id: str
    name: str
    learning_weeks: int
    difficulty: int
    demand: int
    icon: str


class CareerAlternative(BaseModel):
    id: str
    name: str
    category: str
    median_salary_usd: int
    growth_pct_10y: float
    automation_probability: float
    risk_level: str


class PredictResponse(BaseModel):
    occupation: Occupation
    automation_probability: float
    risk_level: str
    score_cards: List[ScoreCard]
    radar: List[dict]
    pie: List[dict]
    trend: List[TrendPoint]
    top_ai_factors: List[dict]
    skill_recommendations: List[SkillRec]
    career_alternatives: List[CareerAlternative]
    insights: List[str]


# ---------------------------------------------------------------------------
# Startup — train / load the CatBoost model once
# ---------------------------------------------------------------------------
@app.on_event("startup")
async def startup() -> None:
    predictor.load_or_train()
    logger.info("Predictor ready. Occupations: %d", len(OCCUPATIONS))


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
_SCORE_ICON = {
    "communication": "message-circle",
    "leadership": "crown",
    "creativity": "palette",
    "technical": "cpu",
    "learning_ability": "graduation-cap",
    "ai_exposure": "sparkles",
}
_SCORE_LABEL = {
    "communication": "Communication",
    "leadership": "Leadership",
    "creativity": "Creativity",
    "technical": "Technical",
    "learning_ability": "Learning",
    "ai_exposure": "AI Exposure",
}


def _build_trend(prob: float) -> List[TrendPoint]:
    # Cubic-ish increase toward `prob` by 2035, starting at ~40% of prob in 2025.
    years = [2025, 2027, 2030, 2035]
    base = prob * 0.42
    peak = min(prob * 1.15, 99.0)
    steps = [0.0, 0.35, 0.7, 1.0]
    return [
        TrendPoint(year=y, probability=round(base + (peak - base) * s, 1))
        for y, s in zip(years, steps)
    ]


def _skill_recommendations(risk: str, ai_exposure: float) -> List[SkillRec]:
    """Pick top skills based on risk + current AI exposure."""
    ranked = sorted(SKILL_CATALOG, key=lambda s: -s["demand"])
    if risk == "High":
        picks = ranked[:7]
    elif risk == "Medium":
        picks = ranked[:6]
    else:
        picks = ranked[:5]
    return [SkillRec(**s) for s in picks]


def _career_alternatives(current_id: str, prob: float) -> List[CareerAlternative]:
    """Return safer high-growth alternatives sorted by lowest automation risk."""
    candidates = [o for o in OCCUPATIONS if o["id"] != current_id]
    candidates = sorted(
        candidates,
        key=lambda o: (o["automation_probability"], -o["growth_pct_10y"]),
    )[:5]
    result = []
    for o in candidates:
        result.append(
            CareerAlternative(
                id=o["id"],
                name=o["name"],
                category=o["category"],
                median_salary_usd=o["median_salary_usd"],
                growth_pct_10y=o["growth_pct_10y"],
                automation_probability=o["automation_probability"],
                risk_level=predictor._risk_level(o["automation_probability"]),
            )
        )
    return result


def _insights(occ: dict, prob: float, risk: str) -> List[str]:
    lines = []
    if risk == "High":
        lines.append(
            f"{occ['name']} shows a high automation footprint ({prob:.0f}%). Pivoting into AI-augmented adjacencies is strongly recommended within 24 months."
        )
    elif risk == "Medium":
        lines.append(
            f"{occ['name']} sits in the transformation zone ({prob:.0f}%). Roles will change substantially — mastering AI tooling now compounds career resilience."
        )
    else:
        lines.append(
            f"{occ['name']} remains highly future-proof ({prob:.0f}%). Deepen human-centric skills to widen the gap."
        )
    lines.append(
        "Learning agility and critical thinking are the two variables our model weights highest against automation."
    )
    lines.append(
        "Compounding one AI-native skill every quarter outperforms broad, shallow upskilling."
    )
    return lines


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@api.get("/")
async def root() -> dict:
    return {"service": "FutureProof AI", "status": "ok"}


@api.get("/occupations", response_model=List[Occupation])
async def list_occupations() -> list:
    return [Occupation(id=o["id"], name=o["name"], category=o["category"]) for o in OCCUPATIONS]


@api.post("/predict", response_model=PredictResponse)
async def predict(req: PredictRequest) -> PredictResponse:
    try:
        result = predictor.predict(
            occupation_id=req.occupation_id,
            experience=req.experience,
            education=req.education,
            ai_usage=req.ai_usage,
        )
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc

    features = result["features"]
    prob = result["automation_probability"]
    risk = result["risk_level"]
    occ = result["occupation"]

    score_cards = [
        ScoreCard(
            key=k,
            label=_SCORE_LABEL[k],
            value=round(features[k], 1),
            icon=_SCORE_ICON[k],
        )
        for k in ["communication", "leadership", "creativity", "technical", "learning_ability", "ai_exposure"]
    ]

    radar = [
        {"axis": "Communication", "value": round(features["communication"], 1)},
        {"axis": "Leadership", "value": round(features["leadership"], 1)},
        {"axis": "Technical", "value": round(features["technical"], 1)},
        {"axis": "Learning", "value": round(features["learning_ability"], 1)},
        {"axis": "Creativity", "value": round(features["creativity"], 1)},
        {"axis": "Business", "value": round((features["leadership"] + features["communication"]) / 2, 1)},
    ]
    total = sum(features[k] for k in ["communication", "technical", "leadership", "creativity", "learning_ability"])
    total += (features["leadership"] + features["communication"]) / 2  # business
    pie = [
        {"name": "Communication", "value": round(features["communication"] / total * 100, 1)},
        {"name": "Technical", "value": round(features["technical"] / total * 100, 1)},
        {"name": "Leadership", "value": round(features["leadership"] / total * 100, 1)},
        {"name": "Creativity", "value": round(features["creativity"] / total * 100, 1)},
        {"name": "Learning", "value": round(features["learning_ability"] / total * 100, 1)},
        {"name": "Business", "value": round(((features["leadership"] + features["communication"]) / 2) / total * 100, 1)},
    ]

    return PredictResponse(
        occupation=Occupation(id=occ["id"], name=occ["name"], category=occ["category"]),
        automation_probability=prob,
        risk_level=risk,
        score_cards=score_cards,
        radar=radar,
        pie=pie,
        trend=_build_trend(prob),
        top_ai_factors=TOP_AI_FACTORS,
        skill_recommendations=_skill_recommendations(risk, features["ai_exposure"]),
        career_alternatives=_career_alternatives(occ["id"], prob),
        insights=_insights(occ, prob, risk),
    )


app.include_router(api)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)
