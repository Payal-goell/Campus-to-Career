import random

from rules import (
    MIL,
    TIME_BUDGET_SHARE,
    count_violations,
    feature_names,
    featurize,
    finalize,
    normalize_profile,
    rule_select,
    total_hours,
)
from train import random_profile


def test_featurize_length_matches_names():
    p = normalize_profile({
        "course": "CSE",
        "graduation_year": 2029,
        "skills": {"programming": 1},
        "role": "sde",
        "goal": "product_company",
        "weekly_hours": 10,
        "readiness": 40,
    })
    assert len(featurize(p)) == len(feature_names())


def test_prereq_order_and_budget_1000_profiles():
    rng = random.Random(7)
    violations = 0
    for _ in range(1000):
        p = random_profile(rng)
        kept, _, _ = finalize(p, rule_select(p))
        violations += count_violations(kept, p["skills"])
        used = sum(MIL[mid]["hours"] for mid in kept)
        assert used <= TIME_BUDGET_SHARE * total_hours(p) + 1e-6
    assert violations == 0
