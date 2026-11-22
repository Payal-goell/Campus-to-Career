# Campus to Career — Roadmap ML model

This document describes the **hybrid ML + rules** career-roadmap system: every input factor, the feature vector, the model, evaluation metrics, the safety layer, and how to train / run / extend it.

The model **never invents steps**. It only scores milestones from a fixed catalog. Ordering, prerequisites, the time budget, and human-readable reasons are applied afterward by deterministic rules.

---

## 1. What the system does

Given a student profile, produce an ordered list of learning / career steps such that:

1. Every step exists in the catalog  
2. Prerequisites appear before dependents (0 order violations)  
3. Total planned hours ≤ **80%** of available study time  
4. Every step has a **reason** (“Why”) string  
5. If the model is missing, unsure, or broken, the student still gets a **rule-based** roadmap  

```
Student profile
      │
      ▼
Featurize (48 numbers)     ← rules.py
      │
      ▼
RandomForest multi-label   ← train.py / artifacts/roadmap_model.joblib
      │  probability per catalog step
      ▼
Threshold (≥ 0.5) → selected step ids
      │
      ▼
Safety layer (rules.py)
  • drop steps the student already completed (skill ≥ to_level)
  • add missing prerequisites
  • topological + stage order
  • fit into 80% time budget
  • attach reasons
      │
      ▼
JSON: { source, steps[], total_hours, hours_available, skipped_for_lack_of_time, note }
```

**Files**

| File | Role |
|------|------|
| `catalog.json` / `catalog.py` | Roles, skills, goals, milestones (editable knowledge) |
| `rules.py` | Features, rule teacher, safety layer, reasons |
| `train.py` | Synthetic (+ optional real) training, eval, save model |
| `roadmap.py` | Load model → predict → finalize (or fall back to rules) |
| `app.py` | FastAPI: `POST /api/roadmap`, `GET /health` |
| `export_training_data.py` | Turn logged roadmaps/feedback into JSONL for retraining |
| `artifacts/roadmap_model.joblib` | Trained scikit-learn model (~13 MB compressed) |

---

## 2. Input factors (student profile)

### Used by the model / rules

| Factor | Type | Range / values | Notes |
|--------|------|----------------|-------|
| **course** | enum | `CSE`, `IT`, `ECE`, `EE`, `ME`, `OTHER` | One-hot in features |
| **role** | enum | `sde`, `web_dev`, `data_analyst`, `ml_engineer`, `cloud_devops` | Target job family |
| **goal** | enum | `product_company`, `service_company`, `startup`, `higher_studies` | Adjusts required skill levels |
| **skills** | map | each skill → **0–3** | See skill scale below |
| **weekly_hours** | float | **1–60** | Hours the student can study per week |
| **readiness** | float | **0–100** | Self-reported placement readiness |
| **graduation_year** *or* **months_left** | int | year ~2024–2040, or months **1–48** | If only year is given, months left = time until **May** of that year |

### Stored for identity only — **never** model features or training exports

| Factor | Use |
|--------|-----|
| **name** | Display / account |
| **mobile** / phone | Contact |

### Skill scale (0–3)

| Level | Meaning |
|-------|---------|
| 0 | none |
| 1 | basic |
| 2 | good |
| 3 | strong |

**Extracurricular** is treated as a skill: 1 = active in a club, 2 = hackathons / events, 3 = leadership.

### Skills tracked (14)

`programming`, `dsa`, `web_basics`, `fullstack`, `sql`, `git`, `statistics`, `ml_basics`, `system_design`, `cloud`, `aptitude`, `communication`, `projects`, `extracurricular`

### Roles → required skill levels (base table)

Goal adjustments are applied **only** to skills the role already requires (> 0), then clamped to 0–3.

| Role id | Label | Highlights (base) |
|---------|-------|-------------------|
| `sde` | Software Engineer | programming 3, dsa 3, system_design 2, git 2, projects 2 |
| `web_dev` | Web Developer | web_basics 3, fullstack 3, programming 2, dsa 2 |
| `data_analyst` | Data Analyst | sql 3, statistics 3, communication 3, programming 2 |
| `ml_engineer` | ML Engineer | programming 3, statistics 3, ml_basics 3 |
| `cloud_devops` | Cloud / DevOps | cloud 3, git 3, programming 2 |

### Goal adjustments

| Goal | Deltas (on required skills only) |
|------|----------------------------------|
| `product_company` | dsa +1, system_design +1 |
| `service_company` | aptitude +1, dsa −1 |
| `startup` | fullstack +1, projects +1, extracurricular +1 |
| `higher_studies` | aptitude +1, statistics +1, dsa −1 |

### Derived quantities (not typed by the user)

| Name | Formula |
|------|---------|
| `months_left` | From graduation year → May of that year, clamped 1–48 |
| `total_hours` | `weekly_hours × 4.3 × months_left` (available study pool) |
| `hours_available` (in response) | `0.8 × total_hours` (budget the roadmap may use) |
| `gap_<skill>` | `max(0, required[skill] − current[skill])` |
| `gap_total` | Sum of all skill gaps |

---

## 3. Feature vector (model input)

Length: **48** floats. Built by `rules.featurize(profile)`.

| Block | Count | Encoding |
|-------|------:|----------|
| Course one-hot | 6 | `course_CSE` … `course_OTHER` |
| Role one-hot | 5 | `role_sde` … `role_cloud_devops` |
| Goal one-hot | 4 | `goal_product_company` … `goal_higher_studies` |
| Time / effort | 4 | `months_left`, `weekly_hours`, `total_hours`, `readiness` |
| Current skills | 14 | `skill_<name>` ∈ {0,1,2,3} |
| Skill gaps | 14 | `gap_<name>` |
| Aggregate gap | 1 | `gap_total` |
| **Total** | **48** | |

Name and mobile are **not** in this vector.

---

## 4. Labels (model output)

The model is a **multi-label classifier**: one binary label per catalog milestone.

- Catalog size: **53** milestones (`catalog.json`)  
- Label `1` = “this step is relevant for this student” (before time capping)  
- Label `0` = not relevant  

During Phase 1 training, labels come from the **rule teacher** (`rules.rule_select`), not from the final time-trimmed list. The safety layer always re-applies prerequisites and the hour budget after prediction.

### Milestone kinds

1. **Skill ladders** — e.g. `prog_basics` → `prog_intermediate` → `prog_advanced` with `skill` + `to_level`  
2. **Special / stage steps** — `skill = null` (resume, internship, mocks, placement, higher studies, academic plan, habits, certs, testing, web security, portfolio)

Each milestone has: `id`, `title`, `skill`, `to_level`, `prereqs[]`, `hours`, `why`, `stage`.

The model may **only** recommend ids from this list.

---

## 5. The ML model itself

| Property | Value |
|----------|--------|
| Algorithm | `sklearn.ensemble.RandomForestClassifier` |
| Task | Multi-label (one tree ensemble head per milestone via sklearn multi-output) |
| Hyperparameters | `n_estimators=100`, `max_depth=14`, `min_samples_leaf=5`, `n_jobs=-1`, `random_state=1` |
| Artifact | `artifacts/roadmap_model.joblib` (joblib, compress=3, ~13 MB) |
| Inference | `predict_proba` → probability that label `1` is true for each step |
| Selection threshold | **0.5** (`roadmap.THRESHOLD`) |
| Uncertainty fallback | If share of probabilities in **(0.35, 0.65)** > **0.25**, discard ML and use rules |

### What the forest learns

It approximates the rule teacher: *which* catalog steps are relevant given course, role, goal, skill levels, gaps, time, and readiness. It does **not** learn order, hours packing, or explanation text.

### Fallbacks (`source: "rules"`)

Returned when any of these happen:

- Model file missing / unloadable  
- Label count ≠ current catalog size (catalog changed without retrain)  
- Model “unsure” (see threshold above)  
- Inference exception  

The Next.js app also falls back to its TypeScript rule engine if the FastAPI service times out (8 s) or is unreachable.

---

## 6. Rules / safety layer (always runs after ML or as teacher)

Applied by `rules.finalize` → `rules.build_steps`:

1. **Drop done** — if student skill ≥ milestone `to_level`  
2. **Prerequisite closure** — add every missing prereq (unless already done)  
3. **Order** — topological sort; within ready set, sort by `stage` (placement steps may be prioritized when months_left is low)  
4. **Time budget** — keep steps in order until `used_hours > 0.8 × total_hours`; remainder → `skipped_for_lack_of_time`  
5. **Reasons** — template text from skill gap + role + time + catalog `why` (+ “unlocks …” if auto-added as prereq)  

**Hard invariants (tests enforce):**

- Prerequisite-order violations = **0**  
- Planned hours ≤ **80%** of available hours  
- Every returned step has a non-empty `reason`  

> **TODO:** SHAP-based attributions for reasons. Today reasons are template-only (`rules.explain`).

### Rule teacher extras (also used when ML falls back)

Beyond skill-gap ladders, rules may add:

- Resume / internship / mocks / placement applications from `months_left` + `readiness`  
- `higher_studies_prep` when goal is higher studies  
- Campus-aligned extras: `academic_plan`, `habits_basics`, `cert_intro`, `testing_basics`, `web_security`, `portfolio_polish`  

Advanced (`to_level == 3`) skill steps are skipped by the teacher if `readiness < 40` (deferred to a later refresh).

---

## 7. Training data and sample weights

### Phase 1 — synthetic (default)

`train.py` builds ~8000 (configurable) random profiles:

- `months_left` uniform 1–48  
- Skills biased upward with years completed  
- `readiness` from mean skill + noise  
- Course weighted toward CSE/IT  
- Labels = `rule_select(profile)`  

### Phase 2 — real (optional)

`ml/data/real_roadmaps.jsonl` when present. Export via:

```bash
python export_training_data.py --input dumps/roadmaps.json --out data/real_roadmaps.jsonl
```

| Kind | `sample_weight` | Meaning |
|------|----------------:|---------|
| Synthetic | **1** | Rule-generated rows |
| Feedback-derived | **2** | completed / liked → positive; disliked / skipped → negative |
| Expert-corrected | **5** | Manually corrected roadmaps |

Profiles in training files must **not** contain `name`, `mobile`, `phone`, or `fullName`.

### Train / eval commands

```bash
cd ml
source .venv/bin/activate
python train.py                 # fit + save model
python train.py --eval          # same, prints metrics
python train.py --n 2500        # smaller synthetic set
python train.py --real data/real_roadmaps.jsonl
```

Hold-out: 20% test split (`train_test_split`, `random_state=1`).

---

## 8. Metrics (what `--eval` prints)

All metrics are computed on the **test** split after applying the **same safety layer** (`finalize`) to both predictions and teacher labels where noted.

| Metric | Definition | Target / note |
|--------|------------|----------------|
| **Step-level precision** | TP / predicted positives across all steps × students | Higher = fewer irrelevant recommendations |
| **Step-level recall** | TP / true positives | Higher = fewer missed teacher steps |
| **Step-level F1** | Harmonic mean of precision and recall | Primary quality summary |
| **Final roadmap overlap** | Mean Jaccard of finalized ML roadmap vs finalized rule roadmap | 1.0 = identical after safety layer |
| **Prerequisite-order violations** | Count of steps appearing before an unmet prerequisite | **Must be 0** (training exits non-zero if not) |

Example from a recent local retrain (~2500 synthetic, 500 test):

| Metric | Approx. value |
|--------|---------------|
| Precision / recall / F1 | ~0.94 / ~0.89 / ~0.91 |
| Overlap with rules | ~0.88 |
| Prereq violations | **0** |

Numbers change when the catalog or hyperparameters change; always re-check with `python train.py --eval`.

---

## 9. API response shape

`POST /api/roadmap` body = profile (enums validated; skills 0–3; hours 1–60; readiness 0–100).

```json
{
  "source": "ml",
  "steps": [
    {
      "step": 1,
      "id": "sql_basics",
      "title": "SQL basics: SELECT, WHERE, GROUP BY",
      "hours": 25,
      "reason": "Your SQL level is none and Data Analyst needs strong; …",
      "added_as_prerequisite": false
    }
  ],
  "total_hours": 592,
  "hours_available": 722,
  "skipped_for_lack_of_time": ["…"],
  "note": null
}
```

`GET /health` reports `model_loaded` and the fixed enums.

---

## 10. Setup, run, deploy

### Why not Vercel Python?

The model is ~13 MB compressed; with scikit-learn / numpy / joblib it exceeds comfortable serverless limits and cold-start budgets. Run this FastAPI app on **Render / Railway / Fly**; Next.js stays on Vercel and calls `ML_SERVICE_URL`.

### Local setup

```bash
cd ml
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
export ML_MODEL_PATH=artifacts/roadmap_model.joblib
uvicorn app:app --host 127.0.0.1 --port 8000
```

Next.js `.env`:

```bash
ML_SERVICE_URL="http://127.0.0.1:8000"
```

### Docker

```bash
docker build -t ctc-roadmap-ml .
docker run -p 8000:8000 -e ML_MODEL_PATH=/app/artifacts/roadmap_model.joblib ctc-roadmap-ml
```

`render.yaml` is included for Render Docker deploys.

### Tests

```bash
pytest -q
```

Covers: catalog validation, feature length, 1000 random profiles (0 order violations + budget), missing-model fallback, API 422s, three demo students.

---

## 11. Editing the catalog (no ML code)

Edit **`catalog.json`**, then **retrain** if skills or milestones change (feature or label dimension changes).

| Add… | Change |
|------|--------|
| Role | New key under `roles` with a full `required` map for every skill |
| Skill | Append to `skills` + `skill_labels`; update every role; retrain |
| Milestone | Unique `id`, valid `prereqs`, `hours`, `why`; `skill` ∈ skills or `null`; retrain |

Import-time `validate_catalog()` fails loudly on duplicate ids, missing prereqs, cycles, or unknown skills.

---

## 12. Privacy and product rules

1. Model output ⊆ catalog  
2. Prerequisites always ordered correctly  
3. Hours ≤ 80% of available time  
4. Every step has a reason  
5. ML failure → rules fallback (never an empty broken path)  
6. No name/mobile in features or training exports  
7. Secrets only via environment variables (`ML_SERVICE_URL`, `ML_MODEL_PATH`, `DATABASE_URL` on the Next side)

---

## 13. Demo students (manual / `python roadmap.py`)

1. 1st-year CSE, 5 h/week, Data Analyst, service company, readiness 15  
2. Final-year IT, 15 h/week, SDE, product company, readiness 55  
3. 3rd-year ECE, 10 h/week, Web Developer, startup, readiness 35  

Expect non-empty steps, non-empty reasons, and `total_hours ≤ hours_available`.
