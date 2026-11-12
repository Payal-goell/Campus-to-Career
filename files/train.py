"""
train.py  -  Phase 1: use your rules as a teacher.
(The model learns WHICH steps are relevant; ordering, prerequisites and the
time limit are applied afterwards by plain code in rules.py.)

1. make thousands of realistic fake students
2. label each with the rule-based roadmap
3. train a model to predict which catalog steps a student needs
4. evaluate it

Run:  python train.py
Later, replace/add real rows (expert-corrected roadmaps, user feedback) to
the training data -- the rest of the code stays the same.
"""
import random

import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

from catalog import COURSES, GOALS, SKILLS
from rules import (MIL_IDS, ROLE_KEYS, count_violations, featurize, finalize,
                   normalize_profile, rule_select)

MODEL_PATH = "roadmap_model.joblib"


def random_profile(rng):
    months_left = rng.randint(1, 48)
    years_done = (48 - months_left) / 12.0           # 0 (fresher) .. 4 (final year)
    skills = {}
    for s in SKILLS:
        bias = 0.5 if s in ("programming", "extracurricular") else 0.0
        level = 0.55 * years_done + bias + rng.gauss(-0.3, 0.7)
        skills[s] = int(min(3, max(0, round(level))))
    mean_level = sum(skills.values()) / (3 * len(SKILLS))
    readiness = min(100, max(0, mean_level * 90 + years_done * 3 + rng.gauss(0, 10)))
    return normalize_profile({
        "course": rng.choices(COURSES, weights=[40, 20, 12, 8, 8, 12])[0],
        "months_left": months_left,
        "skills": skills,
        "role": rng.choice(ROLE_KEYS),
        "goal": rng.choice(GOALS),
        "weekly_hours": rng.choice([3, 5, 8, 10, 15, 20]),
        "readiness": readiness,
    })


def make_dataset(n, seed=42):
    rng = random.Random(seed)
    profiles = [random_profile(rng) for _ in range(n)]
    X = np.array([featurize(p) for p in profiles])
    Y = np.zeros((n, len(MIL_IDS)), dtype=int)
    for i, p in enumerate(profiles):
        for mid in rule_select(p):                      # teacher label = relevant steps
            Y[i, MIL_IDS.index(mid)] = 1                # (time limit is applied later by code)
    return profiles, X, Y


def proba_matrix(model, X):
    """Probability that each step is needed. Shape: (students, steps)."""
    out = np.zeros((len(X), len(MIL_IDS)))
    for j, pr in enumerate(model.predict_proba(X)):
        classes = list(model.classes_[j])
        if 1 in classes:
            out[:, j] = pr[:, classes.index(1)]
    return out


def main():
    profiles, X, Y = make_dataset(8000)
    idx = np.arange(len(X))
    tr, te = train_test_split(idx, test_size=0.2, random_state=1)

    model = RandomForestClassifier(n_estimators=100, max_depth=14, min_samples_leaf=5,
                                   n_jobs=-1, random_state=1)
    model.fit(X[tr], Y[tr])

    P = proba_matrix(model, X[te])
    pred = (P >= 0.5).astype(int)
    true = Y[te]
    tp = (pred & true).sum()
    precision = tp / max(1, pred.sum())
    recall = tp / max(1, true.sum())
    f1 = 2 * precision * recall / max(1e-9, precision + recall)

    jaccards, violations = [], 0
    for row, i in enumerate(te):
        p = profiles[i]
        chosen = {MIL_IDS[j] for j in range(len(MIL_IDS)) if pred[row, j]}
        kept, _, _ = finalize(p, chosen)                # safety steps on the ML output
        truth = set(finalize(p, {MIL_IDS[j] for j in range(len(MIL_IDS)) if true[row, j]})[0])
        union = set(kept) | truth
        jaccards.append(len(set(kept) & truth) / len(union) if union else 1.0)
        violations += count_violations(kept, p["skills"])

    print(f"Test students                      : {len(te)}")
    print(f"Step-level precision / recall / F1 : {precision:.3f} / {recall:.3f} / {f1:.3f}")
    print(f"Final roadmap overlap with rules   : {np.mean(jaccards):.3f}  (1.0 = identical)")
    print(f"Prerequisite-order violations      : {violations}  (must be 0)")

    joblib.dump(model, MODEL_PATH, compress=3)
    print(f"Saved model -> {MODEL_PATH}")


if __name__ == "__main__":
    main()
