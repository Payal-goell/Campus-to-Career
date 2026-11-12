"""
train.py  -  Phase 1: use rules as a teacher; Phase 2: blend real logged data.

Run:
  python train.py
  python train.py --eval
  python train.py --real ml/data/real_roadmaps.jsonl
"""
from __future__ import annotations

import argparse
import json
import random
from pathlib import Path

import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

from catalog import COURSES, GOALS, SKILLS
from rules import (MIL_IDS, ROLE_KEYS, count_violations, featurize, finalize,
                   normalize_profile, rule_select)

ROOT = Path(__file__).resolve().parent
MODEL_PATH = Path(
    __import__("os").environ.get("ML_MODEL_PATH", str(ROOT / "artifacts" / "roadmap_model.joblib"))
)
REAL_DATA_DEFAULT = ROOT / "data" / "real_roadmaps.jsonl"

WEIGHT_SYNTHETIC = 1.0
WEIGHT_FEEDBACK = 2.0
WEIGHT_EXPERT = 5.0


def random_profile(rng):
    months_left = rng.randint(1, 48)
    years_done = (48 - months_left) / 12.0
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
    weights = np.full(n, WEIGHT_SYNTHETIC, dtype=float)
    for i, p in enumerate(profiles):
        for mid in rule_select(p):
            Y[i, MIL_IDS.index(mid)] = 1
    return profiles, X, Y, weights


def _labels_from_steps(step_ids, positive=True):
    row = np.zeros(len(MIL_IDS), dtype=int)
    for mid in step_ids:
        if mid in MIL_IDS:
            row[MIL_IDS.index(mid)] = 1 if positive else 0
    return row


def load_real_rows(path: Path):
    """
    JSONL rows:
      {"profile": {...}, "step_ids": [...], "kind": "expert"|"feedback",
       "positive_ids": [...], "negative_ids": [...]}
    Name/mobile must not appear in profile.
    """
    if not path.exists():
        return [], np.zeros((0, 0)), np.zeros((0, len(MIL_IDS)), dtype=int), np.zeros(0)

    profiles, rows_x, rows_y, weights = [], [], [], []
    with path.open(encoding="utf-8") as fh:
        for line in fh:
            line = line.strip()
            if not line:
                continue
            obj = json.loads(line)
            for banned in ("name", "mobile", "phone", "fullName"):
                if banned in obj.get("profile", {}):
                    raise ValueError(f"Training export must not include {banned}")
            p = normalize_profile(obj["profile"])
            kind = obj.get("kind", "feedback")
            weight = WEIGHT_EXPERT if kind == "expert" else WEIGHT_FEEDBACK

            if "step_ids" in obj:
                y = _labels_from_steps(obj["step_ids"], positive=True)
            else:
                y = _labels_from_steps(obj.get("positive_ids", []), positive=True)
                for mid in obj.get("negative_ids", []):
                    if mid in MIL_IDS:
                        y[MIL_IDS.index(mid)] = 0

            profiles.append(p)
            rows_x.append(featurize(p))
            rows_y.append(y)
            weights.append(weight)

    if not rows_x:
        return [], np.zeros((0, 0)), np.zeros((0, len(MIL_IDS)), dtype=int), np.zeros(0)
    return profiles, np.array(rows_x), np.array(rows_y), np.array(weights, dtype=float)


def proba_matrix(model, X):
    """Probability that each step is needed. Shape: (students, steps)."""
    out = np.zeros((len(X), len(MIL_IDS)))
    for j, pr in enumerate(model.predict_proba(X)):
        classes = list(model.classes_[j])
        if 1 in classes:
            out[:, j] = pr[:, classes.index(1)]
    return out


def evaluate(model, profiles, X, Y, indices=None):
    idx = indices if indices is not None else np.arange(len(X))
    P = proba_matrix(model, X[idx])
    pred = (P >= 0.5).astype(int)
    true = Y[idx]
    tp = (pred & true).sum()
    precision = tp / max(1, pred.sum())
    recall = tp / max(1, true.sum())
    f1 = 2 * precision * recall / max(1e-9, precision + recall)

    jaccards, violations = [], 0
    for row, i in enumerate(idx):
        p = profiles[i]
        chosen = {MIL_IDS[j] for j in range(len(MIL_IDS)) if pred[row, j]}
        kept, _, _ = finalize(p, chosen)
        truth = set(finalize(p, {MIL_IDS[j] for j in range(len(MIL_IDS)) if true[row, j]})[0])
        union = set(kept) | truth
        jaccards.append(len(set(kept) & truth) / len(union) if union else 1.0)
        violations += count_violations(kept, p["skills"])

    return {
        "n": len(idx),
        "precision": precision,
        "recall": recall,
        "f1": f1,
        "overlap": float(np.mean(jaccards)) if jaccards else 1.0,
        "violations": violations,
    }


def train(n_synthetic=8000, real_path: Path | None = None, seed=1):
    profiles, X, Y, weights = make_dataset(n_synthetic, seed=42)
    if real_path is None:
        real_path = REAL_DATA_DEFAULT
    rp, rX, rY, rW = load_real_rows(real_path)
    if len(rX):
        profiles = profiles + rp
        X = np.vstack([X, rX])
        Y = np.vstack([Y, rY])
        weights = np.concatenate([weights, rW])

    idx = np.arange(len(X))
    tr, te = train_test_split(idx, test_size=0.2, random_state=seed)

    model = RandomForestClassifier(
        n_estimators=100, max_depth=14, min_samples_leaf=5,
        n_jobs=-1, random_state=seed,
    )
    model.fit(X[tr], Y[tr], sample_weight=weights[tr])
    metrics = evaluate(model, profiles, X, Y, te)

    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, MODEL_PATH, compress=3)
    return model, metrics, MODEL_PATH


def main():
    parser = argparse.ArgumentParser(description="Train / eval the roadmap multi-label model")
    parser.add_argument("--eval", action="store_true", help="Train then print eval metrics")
    parser.add_argument("--real", type=Path, default=REAL_DATA_DEFAULT, help="Optional real JSONL")
    parser.add_argument("--n", type=int, default=8000, help="Synthetic student count")
    args = parser.parse_args()

    model, metrics, path = train(n_synthetic=args.n, real_path=args.real)
    print(f"Test students                      : {metrics['n']}")
    print(
        "Step-level precision / recall / F1 : "
        f"{metrics['precision']:.3f} / {metrics['recall']:.3f} / {metrics['f1']:.3f}"
    )
    print(f"Final roadmap overlap with rules   : {metrics['overlap']:.3f}  (1.0 = identical)")
    print(f"Prerequisite-order violations      : {metrics['violations']}  (must be 0)")
    print(f"Saved model -> {path}")
    if metrics["violations"] != 0:
        raise SystemExit("Prerequisite-order violations must be 0")


if __name__ == "__main__":
    main()
