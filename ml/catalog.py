"""
catalog.py  -  the knowledge base of the roadmap system.

Edit catalog.json (not the ML training code) to add roles, skills, or steps.
Skill levels: 0 = none, 1 = basic, 2 = good, 3 = strong
"""
from __future__ import annotations

import json
from pathlib import Path

_CATALOG_PATH = Path(__file__).resolve().parent / "catalog.json"


def _load_raw(path: Path = _CATALOG_PATH) -> dict:
    with path.open(encoding="utf-8") as fh:
        return json.load(fh)


def validate_catalog(data: dict) -> None:
    """Fail loudly if the catalog is invalid."""
    skills = data["skills"]
    skill_set = set(skills)
    if len(skills) != len(skill_set):
        raise ValueError("Duplicate skill names in catalog")

    labels = data.get("skill_labels", {})
    missing_labels = skill_set - set(labels)
    if missing_labels:
        raise ValueError(f"Missing skill_labels for: {sorted(missing_labels)}")

    for role_id, role in data["roles"].items():
        req = role.get("required", {})
        unknown = set(req) - skill_set
        if unknown:
            raise ValueError(f"Role {role_id} references unknown skills: {sorted(unknown)}")
        for s in skills:
            if s not in req:
                raise ValueError(f"Role {role_id} missing required level for skill {s}")

    for goal, adjust in data.get("goal_adjust", {}).items():
        unknown = set(adjust) - skill_set
        if unknown:
            raise ValueError(f"Goal {goal} adjusts unknown skills: {sorted(unknown)}")

    milestones = data["milestones"]
    ids = [m["id"] for m in milestones]
    if len(ids) != len(set(ids)):
        dupes = sorted({i for i in ids if ids.count(i) > 1})
        raise ValueError(f"Duplicate milestone ids: {dupes}")

    by_id = {m["id"]: m for m in milestones}
    for m in milestones:
        skill = m.get("skill")
        if skill is not None and skill not in skill_set:
            raise ValueError(f"Milestone {m['id']} uses unknown skill {skill}")
        for pre in m.get("prereqs", []):
            if pre not in by_id:
                raise ValueError(f"Milestone {m['id']} has missing prerequisite {pre}")

    # Cycle detection (DFS)
    visiting: set[str] = set()
    visited: set[str] = set()

    def dfs(mid: str) -> None:
        if mid in visited:
            return
        if mid in visiting:
            raise ValueError(f"Catalog prerequisite cycle involving {mid}")
        visiting.add(mid)
        for pre in by_id[mid].get("prereqs", []):
            dfs(pre)
        visiting.remove(mid)
        visited.add(mid)

    for mid in by_id:
        dfs(mid)


def _normalize_milestones(raw: list[dict]) -> list[dict]:
    out = []
    for m in raw:
        to_level = m.get("to_level")
        stage = m.get("stage")
        if stage is None:
            stage = to_level if to_level is not None else 3
        out.append({
            "id": m["id"],
            "title": m["title"],
            "skill": m.get("skill"),
            "to_level": to_level,
            "prereqs": list(m.get("prereqs", [])),
            "hours": int(m["hours"]),
            "why": m["why"],
            "stage": int(stage),
        })
    return out


_DATA = _load_raw()
validate_catalog(_DATA)

LEVELS = {int(k): v for k, v in _DATA["levels"].items()}
COURSES = list(_DATA["courses"])
GOALS = list(_DATA["goals"])
SKILLS = list(_DATA["skills"])
SKILL_LABELS = dict(_DATA["skill_labels"])
ROLES = {k: {"label": v["label"], "required": dict(v["required"])} for k, v in _DATA["roles"].items()}
GOAL_ADJUST = {k: dict(v) for k, v in _DATA.get("goal_adjust", {}).items()}
MILESTONES = _normalize_milestones(_DATA["milestones"])


def reload_catalog(path: Path | None = None) -> None:
    """Reload catalog from disk (used in tests)."""
    global _DATA, LEVELS, COURSES, GOALS, SKILLS, SKILL_LABELS, ROLES, GOAL_ADJUST, MILESTONES
    _DATA = _load_raw(path or _CATALOG_PATH)
    validate_catalog(_DATA)
    LEVELS = {int(k): v for k, v in _DATA["levels"].items()}
    COURSES = list(_DATA["courses"])
    GOALS = list(_DATA["goals"])
    SKILLS = list(_DATA["skills"])
    SKILL_LABELS = dict(_DATA["skill_labels"])
    ROLES = {k: {"label": v["label"], "required": dict(v["required"])} for k, v in _DATA["roles"].items()}
    GOAL_ADJUST = {k: dict(v) for k, v in _DATA.get("goal_adjust", {}).items()}
    MILESTONES = _normalize_milestones(_DATA["milestones"])
