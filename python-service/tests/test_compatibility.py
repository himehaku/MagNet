from app.main import CompatibilityRequest, calculate_compatibility


def test_compatibility_partial_match():
    data = CompatibilityRequest(
        user_skills=[
            "Python",
            "PostgreSQL",
        ],
        job_skills=[
            "Python",
            "Docker",
            "PostgreSQL",
        ],
    )

    result = calculate_compatibility(data)

    assert result["compatibility"] == 66.67
    assert result["matched_skills"] == [
        "postgresql",
        "python",
    ]
    assert result["missing_skills"] == [
        "docker",
    ]


def test_compatibility_full_match():
    data = CompatibilityRequest(
        user_skills=[
            "Python",
            "Docker",
        ],
        job_skills=[
            "Python",
            "Docker",
        ],
    )

    result = calculate_compatibility(data)

    assert result["compatibility"] == 100.0
    assert result["matched_skills"] == [
        "docker",
        "python",
    ]
    assert result["missing_skills"] == []


def test_compatibility_no_match():
    data = CompatibilityRequest(
        user_skills=[
            "Angular",
        ],
        job_skills=[
            "Python",
            "Docker",
        ],
    )

    result = calculate_compatibility(data)

    assert result["compatibility"] == 0.0
    assert result["matched_skills"] == []
    assert result["missing_skills"] == [
        "docker",
        "python",
    ]


def test_compatibility_normalizes_case_spaces_and_duplicates():
    data = CompatibilityRequest(
        user_skills=[
            " Python ",
            "PYTHON",
            " PostgreSQL ",
        ],
        job_skills=[
            "python",
            " postgresql",
            "Docker ",
            "docker",
        ],
    )

    result = calculate_compatibility(data)

    assert result["compatibility"] == 66.67
    assert result["matched_skills"] == [
        "postgresql",
        "python",
    ]
    assert result["missing_skills"] == [
        "docker",
    ]


def test_compatibility_without_job_requirements():
    data = CompatibilityRequest(
        user_skills=[
            "Python",
        ],
        job_skills=[],
    )

    result = calculate_compatibility(data)

    assert result == {
        "compatibility": 0,
        "matched_skills": [],
        "missing_skills": [],
    }


def test_compatibility_ignores_empty_skills():
    data = CompatibilityRequest(
        user_skills=[
            "Python",
            "",
            "   ",
        ],
        job_skills=[
            "Python",
            "Docker",
            "",
            "   ",
        ],
    )

    result = calculate_compatibility(data)

    assert result["compatibility"] == 50.0
    assert result["matched_skills"] == [
        "python",
    ]
    assert result["missing_skills"] == [
        "docker",
    ]