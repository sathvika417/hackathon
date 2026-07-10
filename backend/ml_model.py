"""
CatBoost-based automation probability predictor.

Workflow:
1. Load occupation feature dataset from occupations_data.py
2. Apply sklearn median imputation preprocessing
3. Train a CatBoostRegressor on the feature -> automation_probability mapping
4. Persist the trained model + preprocessor to disk (joblib) for reuse
5. Serve predictions via `predict_automation()`
"""

from __future__ import annotations

import logging
from pathlib import Path
from typing import Dict, List

import joblib
import numpy as np
import pandas as pd
from catboost import CatBoostRegressor
from sklearn.impute import SimpleImputer

from occupations_data import FEATURE_COLUMNS, OCCUPATIONS

logger = logging.getLogger(__name__)

MODEL_DIR = Path(__file__).parent / "models"
MODEL_DIR.mkdir(exist_ok=True)
MODEL_PATH = MODEL_DIR / "catboost_automation.cbm"
IMPUTER_PATH = MODEL_DIR / "imputer.joblib"


class AutomationPredictor:
    def __init__(self) -> None:
        self.model: CatBoostRegressor | None = None
        self.imputer: SimpleImputer | None = None
        self.occupations_by_id: Dict[str, dict] = {o["id"]: o for o in OCCUPATIONS}

    # ---------- training ----------
    def _build_frame(self) -> pd.DataFrame:
        return pd.DataFrame(OCCUPATIONS)

    def train(self) -> None:
        df = self._build_frame()
        X = df[FEATURE_COLUMNS].astype(float)
        y = df["automation_probability"].astype(float)

        self.imputer = SimpleImputer(strategy="median")
        X_prep = self.imputer.fit_transform(X)

        self.model = CatBoostRegressor(
            iterations=600,
            depth=5,
            learning_rate=0.05,
            loss_function="RMSE",
            random_seed=42,
            verbose=False,
        )
        self.model.fit(X_prep, y)
        self.model.save_model(str(MODEL_PATH))
        joblib.dump(self.imputer, IMPUTER_PATH)
        logger.info("CatBoost automation model trained on %d occupations", len(df))

    def load_or_train(self) -> None:
        if MODEL_PATH.exists() and IMPUTER_PATH.exists():
            try:
                self.model = CatBoostRegressor()
                self.model.load_model(str(MODEL_PATH))
                self.imputer = joblib.load(IMPUTER_PATH)
                logger.info("Loaded persisted CatBoost model from disk")
                return
            except Exception as exc:  # noqa: BLE001
                logger.warning("Failed to load persisted model (%s); retraining", exc)
        self.train()

    # ---------- inference ----------
    def _adjust_features(
        self,
        base: dict,
        experience: str,
        education: str,
        ai_usage: str,
    ) -> Dict[str, float]:
        """Blend the occupation's base feature profile with the user's context."""
        features = {c: float(base[c]) for c in FEATURE_COLUMNS}

        exp_bump = {"0-2": -6, "2-5": 0, "5-10": 6, "10+": 12}.get(experience, 0)
        edu_bump = {"diploma": -4, "bachelor": 0, "master": 6, "phd": 10}.get(education, 0)
        ai_bump = {"never": -12, "rarely": -6, "sometimes": 0, "often": 8, "daily": 15}.get(
            ai_usage, 0
        )

        features["learning_ability"] = np.clip(
            features["learning_ability"] + exp_bump * 0.5 + edu_bump, 0, 100
        )
        features["leadership"] = np.clip(features["leadership"] + exp_bump, 0, 100)
        features["technical"] = np.clip(features["technical"] + edu_bump * 0.5 + ai_bump * 0.3, 0, 100)
        features["ai_exposure"] = np.clip(features["ai_exposure"] + ai_bump, 0, 100)
        return features

    def predict(
        self,
        occupation_id: str,
        experience: str,
        education: str,
        ai_usage: str,
    ) -> dict:
        if occupation_id not in self.occupations_by_id:
            raise ValueError(f"Unknown occupation_id: {occupation_id}")

        base = self.occupations_by_id[occupation_id]
        features = self._adjust_features(base, experience, education, ai_usage)

        X = pd.DataFrame([[features[c] for c in FEATURE_COLUMNS]], columns=FEATURE_COLUMNS)
        X_prep = self.imputer.transform(X)  # type: ignore[union-attr]
        raw = float(self.model.predict(X_prep)[0])  # type: ignore[union-attr]
        prob = float(np.clip(raw, 2.0, 98.0))

        return {
            "occupation": base,
            "features": features,
            "automation_probability": round(prob, 1),
            "risk_level": self._risk_level(prob),
        }

    @staticmethod
    def _risk_level(prob: float) -> str:
        if prob < 33:
            return "Low"
        if prob < 66:
            return "Medium"
        return "High"

    # ---------- feature importance (top ai factors) ----------
    def feature_importance(self) -> List[dict]:
        if self.model is None:
            return []
        importances = self.model.get_feature_importance()
        pairs = sorted(
            zip(FEATURE_COLUMNS, importances), key=lambda p: p[1], reverse=True
        )
        return [{"feature": f, "importance": float(round(i, 2))} for f, i in pairs]


# module-level singleton
predictor = AutomationPredictor()
