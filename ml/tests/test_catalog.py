from catalog import MILESTONES, SKILLS, _load_raw, validate_catalog


def test_catalog_validates():
    validate_catalog(_load_raw())


def test_unique_ids_and_skills():
    ids = [m["id"] for m in MILESTONES]
    assert len(ids) == len(set(ids))
    for m in MILESTONES:
        if m["skill"] is not None:
            assert m["skill"] in SKILLS
        for pre in m["prereqs"]:
            assert pre in ids


def test_gap_milestones_present():
    ids = {m["id"] for m in MILESTONES}
    for mid in (
        "academic_plan",
        "habits_basics",
        "cert_intro",
        "testing_basics",
        "web_security",
        "portfolio_polish",
    ):
        assert mid in ids
