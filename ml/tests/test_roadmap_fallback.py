import os
from pathlib import Path

import roadmap as roadmap_mod
from roadmap import generate_roadmap


def test_fallback_when_model_missing(tmp_path, monkeypatch):
    missing = tmp_path / "no-model.joblib"
    monkeypatch.setenv("ML_MODEL_PATH", str(missing))
    roadmap_mod._model = None
    roadmap_mod._model_error = None

    result = generate_roadmap({
        "course": "CSE",
        "graduation_year": 2030,
        "skills": {"programming": 1},
        "role": "data_analyst",
        "goal": "service_company",
        "weekly_hours": 5,
        "readiness": 15,
    })
    assert result["source"] == "rules"
    assert result["steps"]
    assert all(s.get("reason") for s in result["steps"])
    assert "Model" in (result.get("note") or "")


def test_demo_students_have_reasons():
    # Restore default model path for subsequent tests
    root = Path(__file__).resolve().parents[1]
    os.environ["ML_MODEL_PATH"] = str(root / "artifacts" / "roadmap_model.joblib")
    roadmap_mod._model = None

    students = [
        {
            "course": "CSE", "graduation_year": 2030,
            "skills": {"programming": 1, "extracurricular": 0},
            "role": "data_analyst", "goal": "service_company",
            "weekly_hours": 5, "readiness": 15,
        },
        {
            "course": "IT", "graduation_year": 2027,
            "skills": {
                "programming": 3, "dsa": 2, "sql": 1, "git": 2,
                "projects": 2, "communication": 1, "aptitude": 1, "extracurricular": 1,
            },
            "role": "sde", "goal": "product_company",
            "weekly_hours": 15, "readiness": 55,
        },
        {
            "course": "ECE", "graduation_year": 2028,
            "skills": {"programming": 1, "web_basics": 1, "extracurricular": 1},
            "role": "web_dev", "goal": "startup",
            "weekly_hours": 10, "readiness": 35,
        },
    ]
    for student in students:
        result = generate_roadmap(student)
        assert result["steps"], f"empty roadmap for {student['role']}"
        assert all(step["reason"].strip() for step in result["steps"])
        assert result["total_hours"] <= result["hours_available"] + 1e-6
