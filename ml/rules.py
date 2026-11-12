"""
rules.py  -  everything that is NOT machine learning:
  * turning a student profile into numbers (features)
  * rule-based roadmap (teacher + fallback)
  * safety steps applied to ANY roadmap (prerequisites, order, time limit)
  * human-readable reason for every step

TODO(SHAP): replace or augment template reasons with SHAP feature attributions later.
"""
from __future__ import annotations

import heapq
import math
from datetime import date

from catalog import (COURSES, GOALS, GOAL_ADJUST, LEVELS, MILESTONES, ROLES,
                     SKILL_LABELS, SKILLS)

MIL = {m["id"]: m for m in MILESTONES}
MIL_IDS = [m["id"] for m in MILESTONES]
ROLE_KEYS = list(ROLES.keys())
TIME_BUDGET_SHARE = 0.8  # use at most 80% of the student's available hours


def refresh_indexes() -> None:
    """Call after catalog.reload_catalog() so rules see the new milestones."""
    global MIL, MIL_IDS, ROLE_KEYS
    from catalog import MILESTONES as MS, ROLES as RS
    MIL = {m["id"]: m for m in MS}
    MIL_IDS = [m["id"] for m in MS]
    ROLE_KEYS = list(RS.keys())


# ---------------------------------------------------------------- profile
def months_left_from_year(grad_year, today=None):
    """Assumes graduation in May of the graduation year."""
    today = today or date.today()
    months = (grad_year - today.year) * 12 + (5 - today.month)
    return max(1, min(48, months))


def normalize_profile(profile):
    p = dict(profile)
    if "months_left" not in p:
        p["months_left"] = months_left_from_year(p["graduation_year"])
    p["skills"] = {s: int(p.get("skills", {}).get(s, 0)) for s in SKILLS}
    p["weekly_hours"] = max(1, float(p["weekly_hours"]))
    p["readiness"] = float(p.get("readiness", 0))
    return p


def required_levels(role, goal):
    req = dict(ROLES[role]["required"])
    for skill, delta in GOAL_ADJUST.get(goal, {}).items():
        if req[skill] > 0:
            req[skill] = max(0, min(3, req[skill] + delta))
    return req


def total_hours(p):
    return p["weekly_hours"] * 4.3 * p["months_left"]


# ---------------------------------------------------------------- features
def feature_names():
    names = [f"course_{c}" for c in COURSES]
    names += [f"role_{r}" for r in ROLE_KEYS]
    names += [f"goal_{g}" for g in GOALS]
    names += ["months_left", "weekly_hours", "total_hours", "readiness"]
    names += [f"skill_{s}" for s in SKILLS]
    names += [f"gap_{s}" for s in SKILLS]
    names += ["gap_total"]
    return names


def featurize(p):
    req = required_levels(p["role"], p["goal"])
    gaps = [max(0, req[s] - p["skills"][s]) for s in SKILLS]
    row = [1.0 if p["course"] == c else 0.0 for c in COURSES]
    row += [1.0 if p["role"] == r else 0.0 for r in ROLE_KEYS]
    row += [1.0 if p["goal"] == g else 0.0 for g in GOALS]
    row += [p["months_left"], p["weekly_hours"], total_hours(p), p["readiness"]]
    row += [p["skills"][s] for s in SKILLS]
    row += gaps
    row += [sum(gaps)]
    return row


# ---------------------------------------------------------------- rules
def is_done(mid, skills):
    m = MIL[mid]
    return m["skill"] is not None and skills.get(m["skill"], 0) >= m["to_level"]


def rule_select(p):
    """Rule engine: which steps does this student need? (before safety steps)"""
    req = required_levels(p["role"], p["goal"])
    sel = set()
    for m in MILESTONES:
        s = m["skill"]
        if s is None:
            continue
        cur = p["skills"][s]
        if cur < m["to_level"] <= req[s]:
            if m["to_level"] == 3 and p["readiness"] < 40:
                continue  # beginners get advanced steps in a later refresh
            sel.add(m["id"])

    ml, r, goal, role = p["months_left"], p["readiness"], p["goal"], p["role"]
    if ml <= 18:
        sel.add("resume_ats")
    if 6 <= ml <= 24:
        sel.add("internship")
    if r >= 50 or ml <= 8:
        sel.add("mock_interviews")
    if ml <= 8 and r >= 40 and goal != "higher_studies":
        sel.add("placement_applications")
    if goal == "higher_studies":
        sel.add("higher_studies_prep")

    # Career steps carried over from the TypeScript journey templates
    if ml >= 3:
        sel.add("academic_plan")
        sel.add("habits_basics")
    if ml >= 6 and p["skills"]["programming"] < 3:
        sel.add("cert_intro")
    if req.get("programming", 0) >= 2 and p["skills"]["programming"] >= 1:
        sel.add("testing_basics")
    if role in ("web_dev", "sde") and req.get("web_basics", 0) >= 2:
        sel.add("web_security")
    if ml <= 18 and req.get("projects", 0) >= 2:
        sel.add("portfolio_polish")

    return sel


# ---------------------------------------------------------------- safety steps
def _closure(selected, skills):
    """Add every missing prerequisite (skipping what the student already knows)."""
    out, stack = set(), list(selected)
    while stack:
        mid = stack.pop()
        if mid in out:
            continue
        out.add(mid)
        for pre in MIL[mid]["prereqs"]:
            if not is_done(pre, skills) and pre not in out:
                stack.append(pre)
    return out


def _order(ids, p):
    """Topological order: prerequisites first, easier stages first."""
    ml = p["months_left"]

    def key(mid):
        stage = MIL[mid]["stage"]
        if mid in ("resume_ats", "mock_interviews", "placement_applications"):
            if ml <= 6:
                stage = 0
            elif ml <= 12:
                stage = 2
        return (stage, MIL_IDS.index(mid))

    indeg = {m: sum(1 for pre in MIL[m]["prereqs"] if pre in ids) for m in ids}
    heap = [(key(m), m) for m in ids if indeg[m] == 0]
    heapq.heapify(heap)
    result = []
    while heap:
        _, mid = heapq.heappop(heap)
        result.append(mid)
        for other in ids:
            if mid in MIL[other]["prereqs"]:
                indeg[other] -= 1
                if indeg[other] == 0:
                    heapq.heappush(heap, (key(other), other))
    return result


def finalize(p, selected):
    """selected (from rules OR model) -> (kept_ordered, auto_added, dropped_for_time)"""
    skills = p["skills"]
    selected = {m for m in selected if m in MIL and not is_done(m, skills)}
    full = _closure(selected, skills)
    ordered = _order(full, p)

    budget = TIME_BUDGET_SHARE * total_hours(p)
    kept, used = [], 0.0
    for mid in ordered:
        m = MIL[mid]
        prereqs_ok = all(is_done(pre, skills) or pre in kept for pre in m["prereqs"])
        if prereqs_ok and used + m["hours"] <= budget:
            kept.append(mid)
            used += m["hours"]
    dropped = [m for m in ordered if m not in kept]
    return kept, full - selected, dropped


def count_violations(ordered, skills):
    """How many steps appear before one of their prerequisites? (must be 0)"""
    bad = 0
    for i, mid in enumerate(ordered):
        for pre in MIL[mid]["prereqs"]:
            if not is_done(pre, skills) and pre not in ordered[:i]:
                bad += 1
    return bad


# ---------------------------------------------------------------- reasons
def explain(mid, p, needed_for=None):
    m = MIL[mid]
    parts = []
    role_name = ROLES[p["role"]]["label"]
    if needed_for:
        parts.append(f"This must come first because it unlocks \"{MIL[needed_for]['title']}\".")
    elif m["skill"]:
        req = required_levels(p["role"], p["goal"])[m["skill"]]
        cur = p["skills"][m["skill"]]
        label = SKILL_LABELS[m["skill"]]
        parts.append(
            f"Your {label} level is {LEVELS[cur]} and {role_name} needs {LEVELS[req]}; "
            f"this step takes you to {LEVELS[m['to_level']]}."
        )
    elif mid in ("mock_interviews", "placement_applications"):
        parts.append(f"You have about {p['months_left']} months left and readiness {p['readiness']:.0f}/100.")
    elif mid in ("resume_ats", "internship", "portfolio_polish"):
        parts.append(f"You have about {p['months_left']} months to graduation.")
    elif mid == "higher_studies_prep":
        parts.append("Your goal is higher studies.")
    elif mid in ("academic_plan", "habits_basics", "cert_intro", "testing_basics", "web_security"):
        parts.append(f"This step keeps your {role_name} plan balanced while you still have time.")
    parts.append(m["why"])
    weeks = math.ceil(m["hours"] / max(1.0, p["weekly_hours"]))
    unit = "week" if weeks == 1 else "weeks"
    parts.append(f"About {m['hours']} hours, roughly {weeks} {unit} at {p['weekly_hours']:.0f} h/week.")
    return " ".join(parts)


def build_steps(p, selected, source):
    kept, added, dropped = finalize(p, selected)
    steps = []
    for i, mid in enumerate(kept, 1):
        needed_for = None
        if mid in added:
            needed_for = next((o for o in kept if mid in MIL[o]["prereqs"]), None)
        steps.append({
            "step": i, "id": mid, "title": MIL[mid]["title"],
            "hours": MIL[mid]["hours"], "reason": explain(mid, p, needed_for),
            "added_as_prerequisite": mid in added,
        })
    return {
        "source": source,
        "steps": steps,
        "total_hours": sum(s["hours"] for s in steps),
        "hours_available": round(TIME_BUDGET_SHARE * total_hours(p)),
        "skipped_for_lack_of_time": [MIL[m]["title"] for m in dropped],
        "note": None,
    }


def rule_roadmap(p):
    return build_steps(p, rule_select(p), source="rules")
