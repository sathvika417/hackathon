import math
import pickle
from pathlib import Path

import joblib
import pandas as pd
from fastapi import HTTPException, status

from app.config import get_settings
from app.schemas import OccupationDetail, OccupationListItem, PredictResponse
from app.utils import clamp_probability, normalize_text, risk_level


SCORE_TO_SKILLS = {
    "communication": ["Communication", "Storytelling", "Stakeholder Management"],
    "leadership": ["Leadership", "People Management", "Strategic Planning"],
    "creativity": ["Design Thinking", "Creative Problem Solving", "Product Innovation"],
    "technical": ["Python", "Data Analysis", "Automation Tools"],
    "learning": ["AI Literacy", "Prompt Engineering", "Continuous Learning Systems"],
    "business": ["Business Analysis", "Operations Strategy", "Decision Making"],
    "analytical": ["Analytics", "Critical Thinking", "SQL"],
}

SEARCH_ALIASES = {
    "engineer": ["engineers", "developer", "developers", "engineering"],
    "engineers": ["engineer", "developer", "developers", "engineering"],
    "developer": ["developers", "engineer", "engineers", "programmer", "programmers"],
    "developers": ["developer", "engineer", "engineers", "programmer", "programmers"],
    "programmer": ["programmers", "developer", "developers", "software"],
    "programmers": ["programmer", "developer", "developers", "software"],
}


class PredictorService:
    def __init__(self) -> None:
        self.settings = get_settings()
        self.dataset: pd.DataFrame | None = None
        self.model = None
        self.imputer = None
        self.selected_features: list[str] = []
        self.occupation_index: dict[str, dict] = {}

    def load(self) -> None:
        if self.dataset is not None:
            return

        self.dataset = pd.read_csv(self.settings.dataset_path)
        self.model = self._load_pickle(self.settings.model_path)
        self.imputer = self._load_imputer(self.settings.imputer_path)
        self.selected_features = self._load_pickle(self.settings.selected_features_path)
        self.dataset["__occupation_name__"] = self.dataset.apply(
            lambda row: self._display_name(row.to_dict()),
            axis=1,
        )
        self.dataset["__normalized_occupation__"] = self.dataset["__occupation_name__"].map(normalize_text)
        self.occupation_index = {}

        for record in self.dataset.to_dict(orient="records"):
            normalized = record["__normalized_occupation__"]
            if not normalized:
                continue
            self.occupation_index.setdefault(normalized, record)

    def _load_pickle(self, path: Path):
        with path.open("rb") as file_obj:
            return pickle.load(file_obj)

    def _load_imputer(self, path: Path):
        return joblib.load(path)

    def _ensure_loaded(self) -> None:
        if self.dataset is None:
            self.load()

    def list_occupations(self) -> list[OccupationListItem]:
        self._ensure_loaded()
        seen: set[str] = set()
        items: list[OccupationListItem] = []

        for record in sorted(self.occupation_index.values(), key=lambda item: str(item.get("__occupation_name__") or "")):
            occupation = self._display_name(record)
            if not occupation or occupation in seen:
                continue
            seen.add(occupation)
            items.append(
                OccupationListItem(
                    title=str(occupation),
                    description=str(record.get("Description", "") or ""),
                    job_zone=self._to_float(record.get("Job Zone")),
                    soc_code=record.get("SOC"),
                )
            )
        return items

    def search_occupations(self, query: str) -> list[OccupationListItem]:
        q = normalize_text(query)
        if not q:
            return self.list_occupations()
        return [
            item
            for item in self.list_occupations()
            if q in normalize_text(item.title)
        ]

    def get_occupation(self, occupation_name: str) -> OccupationDetail:
        record = self._get_record(occupation_name)
        occupation_name = self._display_name(record)
        return OccupationDetail(
            title=str(occupation_name),
            description=record.get("Description", ""),
            job_zone=self._to_float(record.get("Job Zone")),
            soc_code=record.get("SOC"),
            communication_score=self._score(record, "Communication_Score"),
            leadership_score=self._score(record, "Leadership_Score"),
            creativity_score=self._score(record, "Creativity_Score"),
            technical_score=self._score(record, "Technical_Score"),
            learning_score=self._score(record, "Learning_Score"),
            business_score=self._score(record, "Business_Score"),
            analytical_score=self._score(record, "Analytical_Score"),
            ai_exposure_score=self._score(record, "AI_Exposure_Score"),
            baseline_probability=round(clamp_probability(self._to_float(record.get("Probability"))), 4),
        )

    def predict(self, occupation_name: str) -> PredictResponse:
        record = self._get_record(occupation_name)
        imputer_features = list(self.imputer.feature_names_in_)
        raw_frame = pd.DataFrame(
            [[self._to_float(record.get(feature)) for feature in imputer_features]],
            columns=imputer_features,
        )
        imputed_frame = pd.DataFrame(
            self.imputer.transform(raw_frame),
            columns=imputer_features,
        )
        model_frame = imputed_frame[self.selected_features]
        raw_probability = float(self.model.predict(model_frame)[0])
        probability = round(clamp_probability(raw_probability), 2)

        response = PredictResponse(
            occupation=self._display_name(record),
            automation_probability=probability,
            risk_level=risk_level(probability),
            communication_score=self._score(record, "Communication_Score", "Skill_Speaking_IM"),
            leadership_score=self._score(record, "Leadership_Score", "Skill_Management_of_Personnel_Resources_IM"),
            creativity_score=self._score(record, "Creativity_Score", "Activity_Thinking_Creatively_IM"),
            technical_score=self._score(record, "Technical_Score", "Knowledge_Computers_and_Electronics_IM"),
            learning_score=self._score(record, "Learning_Score", "Skill_Active_Learning_IM"),
            business_score=self._score(record, "Business_Score", "Knowledge_Administration_and_Management_IM"),
            analytical_score=self._score(record, "Analytical_Score", "Activity_Analyzing_Data_or_Information_IM"),
            ai_exposure_score=self._score(record, "AI_Exposure_Score", "Computer_Usage"),
            recommended_skills=self._recommended_skills(record),
            career_summary=self._career_summary(record, probability),
        )
        return response

    def _get_record(self, occupation_name: str) -> dict:
        self._ensure_loaded()
        key = normalize_text(occupation_name)
        record = self.occupation_index.get(key)
        if not record:
            record = self._closest_record(key)
        if not record:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Occupation '{occupation_name}' not found.",
            )
        return record

    def _closest_record(self, normalized_occupation: str) -> dict | None:
        query_tokens = self._search_tokens(normalized_occupation)
        if not query_tokens:
            return None

        best_score = 0
        best_record = None
        for record in self.occupation_index.values():
            title_tokens = self._search_tokens(record["__normalized_occupation__"])
            score = len(query_tokens.intersection(title_tokens))
            if score > best_score:
                best_score = score
                best_record = record

        return best_record if best_score > 0 else None

    @staticmethod
    def _search_tokens(value: str) -> set[str]:
        tokens = normalize_text(value).split()
        expanded: set[str] = set(tokens)
        for token in tokens:
            expanded.update(SEARCH_ALIASES.get(token, []))
        return expanded

    def _recommended_skills(self, record: dict) -> list[str]:
        scores = {
            "communication": self._score(record, "Communication_Score", "Skill_Speaking_IM"),
            "leadership": self._score(record, "Leadership_Score", "Skill_Management_of_Personnel_Resources_IM"),
            "creativity": self._score(record, "Creativity_Score", "Activity_Thinking_Creatively_IM"),
            "technical": self._score(record, "Technical_Score", "Knowledge_Computers_and_Electronics_IM"),
            "learning": self._score(record, "Learning_Score", "Skill_Active_Learning_IM"),
            "business": self._score(record, "Business_Score", "Knowledge_Administration_and_Management_IM"),
            "analytical": self._score(record, "Analytical_Score", "Activity_Analyzing_Data_or_Information_IM"),
        }

        ordered_dimensions = sorted(scores.items(), key=lambda item: item[1])
        skills: list[str] = ["AI Literacy"]

        for dimension, _ in ordered_dimensions[:2]:
            for skill in SCORE_TO_SKILLS[dimension]:
                if skill not in skills:
                    skills.append(skill)
                if len(skills) == 5:
                    return skills
        return skills[:5]

    def _career_summary(self, record: dict, probability: float) -> str:
        occupation = self._display_name(record)
        description = record.get("Description", "")
        risk = risk_level(probability)
        ai_exposure = self._score(record, "AI_Exposure_Score", "Computer_Usage")

        if risk == "High":
            outlook = "This role is likely to be reshaped aggressively by automation."
        elif risk == "Medium":
            outlook = "This role is likely to evolve through AI-assisted workflows rather than disappear outright."
        else:
            outlook = "This role appears relatively resilient, especially where human judgment and collaboration remain central."

        return (
            f"{occupation}: {description} {outlook} "
            f"AI exposure is {ai_exposure}/5, so strengthening adjacent digital and human-centered skills will improve long-term resilience."
        )

    def _score(self, record: dict, column: str, fallback_column: str | None = None) -> float:
        value = self._to_float(record.get(column))
        if value == 0.0 and fallback_column:
            value = self._to_float(record.get(fallback_column))
        if value == 0.0 and self.dataset is not None and column in self.dataset:
            value = self._to_float(self.dataset[column].median(skipna=True))
        return round(max(0.0, min(5.0, value)), 2)

    @staticmethod
    def _to_float(value) -> float:
        try:
            parsed = float(value)
        except (TypeError, ValueError):
            return 0.0
        if not math.isfinite(parsed):
            return 0.0
        return parsed

    @staticmethod
    def _display_name(record: dict) -> str:
        for column in ("__occupation_name__", "Occupation", "Title", "SOC"):
            value = record.get(column)
            if isinstance(value, str) and value.strip():
                return value.strip()
        return "Unknown Occupation"


predictor = PredictorService()
