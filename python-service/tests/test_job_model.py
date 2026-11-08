from datetime import datetime, timezone

import pytest
from pydantic import ValidationError

from app.models.job import Job


def valid_job_data():
    return {
        "external_id": "123",
        "title": "Backend Developer",
        "company": "Empresa Demo",
        "description": "Desarrollo backend con Python.",
        "location": "Chile - Remoto",
        "remote": True,
        "category": "Programming",
        "source": "Get on Board",
        "source_url": "https://www.getonbrd.com/jobs/123",
        "published_at": datetime.now(timezone.utc),
        "fetched_at": datetime.now(timezone.utc),
    }


def test_job_accepts_valid_data():
    job = Job(**valid_job_data())

    assert job.external_id == "123"
    assert job.title == "Backend Developer"
    assert job.source == "Get on Board"
    assert str(job.source_url).startswith("https://")


def test_job_accepts_optional_fields_as_none():
    data = valid_job_data()

    data["location"] = None
    data["remote"] = None
    data["category"] = None
    data["published_at"] = None

    job = Job(**data)

    assert job.location is None
    assert job.remote is None
    assert job.category is None
    assert job.published_at is None


def test_job_rejects_invalid_url():
    data = valid_job_data()
    data["source_url"] = "not-a-valid-url"

    with pytest.raises(ValidationError):
        Job(**data)


def test_job_rejects_empty_external_id():
    data = valid_job_data()
    data["external_id"] = ""

    with pytest.raises(ValidationError):
        Job(**data)


def test_job_rejects_empty_title():
    data = valid_job_data()
    data["title"] = ""

    with pytest.raises(ValidationError):
        Job(**data)


def test_job_rejects_missing_required_field():
    data = valid_job_data()
    del data["source"]

    with pytest.raises(ValidationError):
        Job(**data)