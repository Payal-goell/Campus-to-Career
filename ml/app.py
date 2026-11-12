"""
FastAPI service for hybrid ML + rules roadmaps.

  uvicorn app:app --host 0.0.0.0 --port 8000
"""
from __future__ import annotations

from contextlib import asynccontextmanager
from typing import Any, Literal

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator

from catalog import COURSES, GOALS, ROLES, SKILLS
from roadmap import generate_roadmap, model_loaded, try_load_model
from rules import months_left_from_year

Course = Literal["CSE", "IT", "ECE", "EE", "ME", "OTHER"]
Goal = Literal["product_company", "service_company", "startup", "higher_studies"]
Role = Literal["sde", "web_dev", "data_analyst", "ml_engineer", "cloud_devops"]


@asynccontextmanager
async def lifespan(_app: FastAPI):
    try_load_model()
    yield


app = FastAPI(title="Campus to Career Roadmap ML", version="1.0.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class StudentProfileIn(BaseModel):
    course: Course
    role: Role
    goal: Goal
    weekly_hours: float = Field(..., ge=1, le=60)
    readiness: float = Field(..., ge=0, le=100)
    graduation_year: int | None = Field(default=None, ge=2024, le=2040)
    months_left: int | None = Field(default=None, ge=1, le=48)
    skills: dict[str, int] = Field(default_factory=dict)
    # Identification only — never used as model features
    name: str | None = None
    mobile: str | None = None

    @field_validator("course")
    @classmethod
    def course_ok(cls, v: str) -> str:
        if v not in COURSES:
            raise ValueError(f"course must be one of {COURSES}")
        return v

    @field_validator("role")
    @classmethod
    def role_ok(cls, v: str) -> str:
        if v not in ROLES:
            raise ValueError(f"role must be one of {list(ROLES)}")
        return v

    @field_validator("goal")
    @classmethod
    def goal_ok(cls, v: str) -> str:
        if v not in GOALS:
            raise ValueError(f"goal must be one of {GOALS}")
        return v

    @field_validator("skills")
    @classmethod
    def skills_ok(cls, v: dict[str, int]) -> dict[str, int]:
        cleaned: dict[str, int] = {}
        for key, level in v.items():
            if key not in SKILLS:
                raise ValueError(f"Unknown skill '{key}'. Allowed: {SKILLS}")
            if level not in (0, 1, 2, 3):
                raise ValueError(f"Skill '{key}' level must be 0-3")
            cleaned[key] = int(level)
        return cleaned

    def to_profile(self) -> dict[str, Any]:
        payload: dict[str, Any] = {
            "course": self.course,
            "role": self.role,
            "goal": self.goal,
            "weekly_hours": self.weekly_hours,
            "readiness": self.readiness,
            "skills": self.skills,
        }
        if self.months_left is not None:
            payload["months_left"] = self.months_left
        elif self.graduation_year is not None:
            payload["graduation_year"] = self.graduation_year
            payload["months_left"] = months_left_from_year(self.graduation_year)
        else:
            raise ValueError("Provide graduation_year or months_left")
        return payload


class RoadmapStepOut(BaseModel):
    step: int
    id: str
    title: str
    hours: int
    reason: str
    added_as_prerequisite: bool


class RoadmapOut(BaseModel):
    source: Literal["ml", "rules"]
    steps: list[RoadmapStepOut]
    total_hours: int
    hours_available: int
    skipped_for_lack_of_time: list[str]
    note: str | None = None


@app.get("/health")
def health() -> dict[str, Any]:
    return {
        "ok": True,
        "model_loaded": model_loaded(),
        "courses": COURSES,
        "roles": list(ROLES.keys()),
        "goals": GOALS,
        "skills": SKILLS,
    }


@app.post("/api/roadmap", response_model=RoadmapOut)
def api_roadmap(body: StudentProfileIn) -> dict[str, Any]:
    try:
        profile = body.to_profile()
    except ValueError as exc:
        from fastapi import HTTPException
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    return generate_roadmap(profile)
