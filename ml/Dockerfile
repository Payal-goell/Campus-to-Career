FROM python:3.11-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    ML_MODEL_PATH=/app/artifacts/roadmap_model.joblib

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY catalog.json catalog.py rules.py train.py roadmap.py app.py ./
COPY artifacts/roadmap_model.joblib ./artifacts/roadmap_model.joblib
COPY data ./data

EXPOSE 8000
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
