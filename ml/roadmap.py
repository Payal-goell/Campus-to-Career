"""
roadmap.py  -  use the trained model for a real student.

Flow:  profile -> features -> model picks steps -> add prerequisites ->
       order -> fit into available hours -> attach reasons.
If the model file is missing or the model is unsure, the rule-based
roadmap is returned instead.
"""
from __future__ import annotations

import os
from pathlib import Path

import joblib
import numpy as np

from rules import MIL_IDS, build_steps, featurize, normalize_profile, rule_roadmap
from train import MODEL_PATH, proba_matrix

THRESHOLD = 0.5
MAX_UNSURE_SHARE = 0.25

_model = None
_model_error: str | None = None


def model_path() -> Path:
    return Path(os.environ.get("ML_MODEL_PATH", str(MODEL_PATH)))


def model_loaded() -> bool:
    return _model is not None


def _load_model():
    global _model, _model_error
    if _model is not None:
        return _model
    path = model_path()
    try:
        _model = joblib.load(path)
        _model_error = None
        return _model
    except FileNotFoundError as exc:
        _model_error = str(exc)
        raise
    except Exception as exc:  # noqa: BLE001 - surface any load failure as fallback
        _model_error = str(exc)
        raise


def try_load_model() -> bool:
    try:
        _load_model()
        return True
    except Exception:  # noqa: BLE001
        return False


def generate_roadmap(profile):
    p = normalize_profile(profile)
    try:
        model = _load_model()
    except Exception:  # noqa: BLE001
        result = rule_roadmap(p)
        result["note"] = "Model not available, used rules."
        return result

    try:
        proba = proba_matrix(model, np.array([featurize(p)]))[0]
        # Guard against catalog growth vs older models
        if len(proba) != len(MIL_IDS):
            result = rule_roadmap(p)
            result["note"] = "Model label count mismatch, used rules."
            return result
        unsure = float(np.mean((proba > 0.35) & (proba < 0.65)))
        if unsure > MAX_UNSURE_SHARE:
            result = rule_roadmap(p)
            result["note"] = "Model was not confident, used rules."
            return result
        selected = {mid for mid, pr in zip(MIL_IDS, proba) if pr >= THRESHOLD}
        return build_steps(p, selected, source="ml")
    except Exception:  # noqa: BLE001
        result = rule_roadmap(p)
        result["note"] = "Model inference failed, used rules."
        return result


def print_roadmap(result):
    print(f"[source: {result['source']}]  {result.get('note') or ''}")
    print(f"Total {result['total_hours']} h of {result['hours_available']} h available\n")
    for s in result["steps"]:
        print(f"{s['step']:>2}. {s['title']}")
        print(f"    Why: {s['reason']}\n")
    if result["skipped_for_lack_of_time"]:
        print("Not enough time for:", "; ".join(result["skipped_for_lack_of_time"]))


DEMO_STUDENTS = [
    {
        "name": "Demo-1", "course": "CSE", "graduation_year": 2030,
        "skills": {"programming": 1, "extracurricular": 0},
        "role": "data_analyst", "goal": "service_company",
        "weekly_hours": 5, "readiness": 15,
    },
    {
        "name": "Demo-2", "course": "IT", "graduation_year": 2027,
        "skills": {
            "programming": 3, "dsa": 2, "sql": 1, "git": 2,
            "projects": 2, "communication": 1, "aptitude": 1, "extracurricular": 1,
        },
        "role": "sde", "goal": "product_company",
        "weekly_hours": 15, "readiness": 55,
    },
    {
        "name": "Demo-3", "course": "ECE", "graduation_year": 2028,
        "skills": {"programming": 1, "web_basics": 1, "extracurricular": 1},
        "role": "web_dev", "goal": "startup",
        "weekly_hours": 10, "readiness": 35,
    },
]


if __name__ == "__main__":
    for student in DEMO_STUDENTS:
        print("=" * 70)
        print(student["name"], "-", student["role"], "-", student["goal"])
        print("=" * 70)
        # Strip name before ML features (identification only)
        profile = {k: v for k, v in student.items() if k != "name"}
        print_roadmap(generate_roadmap(profile))
