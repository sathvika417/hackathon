from fastapi import APIRouter, Query

from app.predict import predictor
from app.schemas import OccupationDetail, OccupationListItem


router = APIRouter()


@router.get("/occupations", response_model=list[OccupationListItem])
def list_occupations() -> list[OccupationListItem]:
    return predictor.list_occupations()


@router.get("/occupations/search", response_model=list[OccupationListItem])
def search_occupations(q: str = Query(default="", min_length=0, max_length=255)) -> list[OccupationListItem]:
    return predictor.search_occupations(q)


@router.get("/occupation/{occupation_name}", response_model=OccupationDetail)
def get_occupation(occupation_name: str) -> OccupationDetail:
    return predictor.get_occupation(occupation_name)
