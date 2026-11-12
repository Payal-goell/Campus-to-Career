# Campus to Career — Roadmap ML service

Hybrid pipeline: **catalog → RandomForest multi-label model → rules safety layer**.  
The model only scores catalog steps; prerequisites, ordering, the 80% time budget, and reasons come from `rules.py`.

## Why a separate service (not Vercel Python)

The trained model is ~13 MB compressed. With scikit-learn / numpy / joblib the bundle is a poor fit for Vercel serverless size and cold starts. Deploy this FastAPI app on **Render, Railway, or Fly**; keep Next.js on Vercel and set `ML_SERVICE_URL`.

## Setup

```bash
cd ml
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

## Edit the catalog (no ML code changes)

Edit [`catalog.json`](catalog.json):

| Add… | What to change |
|------|----------------|
| **Role** | Entry under `roles` with a full `required` map for every skill in `skills` |
| **Skill** | Append to `skills` + `skill_labels`, then set levels on every role; **retrain** (feature size changes) |
| **Milestone** | Append to `milestones` with unique `id`, `prereqs` that exist, `hours`, `why`; skill must be in `skills` or `null`; **retrain** (label count changes) |

Startup / import runs `validate_catalog()`: unique ids, known prereqs, no cycles, skills ⊆ `SKILLS`. Invalid catalogs fail loudly.

## Train

```bash
python train.py                 # synthetic teacher labels
python train.py --eval          # print precision/recall/F1, rule overlap, prereq violations
python train.py --real data/real_roadmaps.jsonl
```

Sample weights: synthetic `1`, feedback-derived `2`, expert-corrected `5`.  
Model path: `artifacts/roadmap_model.joblib` (override with `ML_MODEL_PATH`).

## Run the API

```bash
export ML_MODEL_PATH=artifacts/roadmap_model.joblib
uvicorn app:app --host 0.0.0.0 --port 8000
```

- `GET /health` → `{ ok, model_loaded, ... }`
- `POST /api/roadmap` → roadmap JSON (`source`, `steps` with `reason`, hours, skipped)

## Docker

```bash
docker build -t ctc-roadmap-ml .
docker run -p 8000:8000 -e ML_MODEL_PATH=/app/artifacts/roadmap_model.joblib ctc-roadmap-ml
```

## Env (Next.js)

| Variable | Purpose |
|----------|---------|
| `ML_SERVICE_URL` | Base URL of this service, e.g. `http://127.0.0.1:8000` |
| `ML_MODEL_PATH` | Optional path inside the ML container |

## Export training data

```bash
python export_training_data.py --input dumps/roadmaps.json --out data/real_roadmaps.jsonl
```

Never put `name` / `mobile` / `phone` in profile JSON for training.

## Tests

```bash
pytest -q
```

## TODO

- Add SHAP-based reasons later; today reasons come from the templates in `rules.explain`.
