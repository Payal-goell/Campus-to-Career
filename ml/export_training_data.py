"""
Export logged roadmaps + feedback into JSONL for train.py.

Reads a JSON dump (from Prisma / admin export) — never includes name or mobile.

Usage:
  python export_training_data.py --input dumps/roadmaps.json --out data/real_roadmaps.jsonl
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

BANNED_KEYS = {"name", "mobile", "phone", "fullName", "full_name"}


def strip_pii(profile: dict) -> dict:
    return {k: v for k, v in profile.items() if k not in BANNED_KEYS}


def rows_from_dump(payload: dict | list) -> list[dict]:
    """
    Accepts either:
      { "roadmaps": [ { id, profile, steps, source, feedback: [...] } ] }
    or a bare list of roadmap objects.
    """
    roadmaps = payload["roadmaps"] if isinstance(payload, dict) else payload
    out: list[dict] = []
    for rm in roadmaps:
        profile = strip_pii(rm.get("profile") or {})
        steps = rm.get("steps") or []
        step_ids = [s.get("id") for s in steps if s.get("id")]
        feedback = rm.get("feedback") or []

        if rm.get("expert_corrected"):
            out.append({
                "kind": "expert",
                "profile": profile,
                "step_ids": step_ids,
            })
            continue

        positive, negative = set(step_ids), set()
        for fb in feedback:
            action = fb.get("action")
            sid = fb.get("stepId") or fb.get("step_id")
            if not sid:
                continue
            if action in ("completed", "liked"):
                positive.add(sid)
                negative.discard(sid)
            elif action in ("disliked", "skipped"):
                negative.add(sid)
                positive.discard(sid)

        out.append({
            "kind": "feedback",
            "profile": profile,
            "positive_ids": sorted(positive),
            "negative_ids": sorted(negative),
            "step_ids": step_ids,
        })
    return out


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", type=Path, required=True, help="JSON dump of roadmaps + feedback")
    parser.add_argument("--out", type=Path, default=Path("data/real_roadmaps.jsonl"))
    args = parser.parse_args()

    payload = json.loads(args.input.read_text(encoding="utf-8"))
    rows = rows_from_dump(payload)
    args.out.parent.mkdir(parents=True, exist_ok=True)
    with args.out.open("w", encoding="utf-8") as fh:
        for row in rows:
            for banned in BANNED_KEYS:
                if banned in row.get("profile", {}):
                    raise SystemExit(f"Refusing to export PII field: {banned}")
            fh.write(json.dumps(row) + "\n")
    print(f"Wrote {len(rows)} rows -> {args.out}")


if __name__ == "__main__":
    main()
