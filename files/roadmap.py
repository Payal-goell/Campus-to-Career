"""
roadmap.py  -  use the trained model for a real student.

    from roadmap import generate_roadmap
    result = generate_roadmap(profile)

Flow:  profile -> features -> model picks steps -> add prerequisites ->
       order -> fit into available hours -> attach reasons.
If the model file is missing or the model is unsure, the rule-based
roadmap is returned instead (so students never get a bad roadmap).
"""
import joblib
import numpy as np

from rules import (MIL_IDS, build_steps, featurize, normalize_profile,
                   rule_roadmap)
from train import MODEL_PATH, proba_matrix

THRESHOLD = 0.5          # step is recommended if probability >= this
MAX_UNSURE_SHARE = 0.25  # fallback if >25% of steps have probability 0.35-0.65

_model = None


def _load_model():
    global _model
    if _model is None:
        _model = joblib.load(MODEL_PATH)
    return _model


def generate_roadmap(profile):
    p = normalize_profile(profile)
    try:
        model = _load_model()
    except FileNotFoundError:
        result = rule_roadmap(p)
        result["note"] = "Model not trained yet, used rules."
        return result

    proba = proba_matrix(model, np.array([featurize(p)]))[0]
    unsure = float(np.mean((proba > 0.35) & (proba < 0.65)))
    if unsure > MAX_UNSURE_SHARE:
        result = rule_roadmap(p)
        result["note"] = "Model was not confident, used rules."
        return result

    selected = {mid for mid, pr in zip(MIL_IDS, proba) if pr >= THRESHOLD}
    return build_steps(p, selected, source="ml")


def print_roadmap(result):
    print(f"[source: {result['source']}]  {result.get('note', '')}")
    print(f"Total {result['total_hours']} h of {result['hours_available']} h available\n")
    for s in result["steps"]:
        print(f"{s['step']:>2}. {s['title']}")
        print(f"    Why: {s['reason']}\n")
    if result["skipped_for_lack_of_time"]:
        print("Not enough time for:", "; ".join(result["skipped_for_lack_of_time"]))


if __name__ == "__main__":
    demo_students = [
        {   # 1st-year CSE, 5 hours/week, wants Data Analyst
            "name": "Demo-1", "course": "CSE", "graduation_year": 2030,
            "skills": {"programming": 1, "extracurricular": 0},
            "role": "data_analyst", "goal": "service_company",
            "weekly_hours": 5, "readiness": 15,
        },
        {   # final-year IT, 15 hours/week, wants SDE in a product company
            "name": "Demo-2", "course": "IT", "graduation_year": 2027,
            "skills": {"programming": 3, "dsa": 2, "sql": 1, "git": 2,
                       "projects": 2, "communication": 1, "aptitude": 1,
                       "extracurricular": 1},
            "role": "sde", "goal": "product_company",
            "weekly_hours": 15, "readiness": 55,
        },
    ]
    for student in demo_students:
        print("=" * 70)
        print(student["name"], "-", student["role"], "-", student["goal"])
        print("=" * 70)
        print_roadmap(generate_roadmap(student))
