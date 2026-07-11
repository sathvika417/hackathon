import re
import unicodedata


def normalize_text(value: str) -> str:
    if value is None:
        return ""
    if not isinstance(value, str):
        value = str(value)
    normalized = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode("ascii")
    normalized = normalized.lower().strip()
    return re.sub(r"[^a-z0-9]+", " ", normalized).strip()


def risk_level(probability: float) -> str:
    if probability < 0.34:
        return "Low"
    if probability < 0.67:
        return "Medium"
    return "High"


def clamp_probability(value: float) -> float:
    return max(0.0, min(1.0, value))
