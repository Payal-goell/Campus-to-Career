from fastapi.testclient import TestClient

from app import app

client = TestClient(app)


def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    body = res.json()
    assert body["ok"] is True
    assert "model_loaded" in body


def test_roadmap_ok():
    res = client.post("/api/roadmap", json={
        "course": "CSE",
        "role": "data_analyst",
        "goal": "service_company",
        "weekly_hours": 5,
        "readiness": 15,
        "graduation_year": 2030,
        "skills": {"programming": 1},
        "name": "ShouldNotBeAFeature",
    })
    assert res.status_code == 200
    body = res.json()
    assert body["source"] in ("ml", "rules")
    assert body["steps"]
    assert all("reason" in s for s in body["steps"])


def test_roadmap_422_bad_skill_level():
    res = client.post("/api/roadmap", json={
        "course": "CSE",
        "role": "sde",
        "goal": "product_company",
        "weekly_hours": 10,
        "readiness": 40,
        "graduation_year": 2028,
        "skills": {"programming": 9},
    })
    assert res.status_code == 422


def test_roadmap_422_bad_course():
    res = client.post("/api/roadmap", json={
        "course": "BIO",
        "role": "sde",
        "goal": "product_company",
        "weekly_hours": 10,
        "readiness": 40,
        "graduation_year": 2028,
        "skills": {},
    })
    assert res.status_code == 422
