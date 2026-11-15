import pytest
import httpx

from fastapi import HTTPException
from app.main import get_jobs
from app.services.jobs_service import fetch_jobs
from app.services.jobs_service import clean_text


def test_clean_text_removes_html():
    value = "<p>Python <strong>Developer</strong></p>"

    result = clean_text(value)

    assert result == "Python Developer"


def test_clean_text_normalizes_whitespace():
    value = "Python     Developer\n\nRemoto\tChile"

    result = clean_text(value)

    assert result == "Python Developer Remoto Chile"


def test_clean_text_handles_none():
    assert clean_text(None) == ""


def test_clean_text_handles_empty_string():
    assert clean_text("") == ""


class FakeResponse:
    def raise_for_status(self):
        pass

    def json(self):
        return {
            "data": [
                {
                    "id": "job-123",
                    "attributes": {
                        "title": "Backend Developer",
                        "description": "Python developer",
                        "countries": ["Chile"],
                        "remote_modality": "fully_remote",
                        "remote": True,
                        "category_name": "Programming",
                        "published_at": 1760000000,
                        "company": {
                            "data": {
                                "id": "company-1"
                            }
                        },
                    },
                    "links": {
                        "public_url": "https://www.getonbrd.com/jobs/job-123"
                    },
                },
                {
                    "id": "job-123",
                    "attributes": {
                        "title": "Backend Developer",
                        "description": "Python developer",
                        "countries": ["Chile"],
                        "remote_modality": "fully_remote",
                        "remote": True,
                        "category_name": "Programming",
                        "published_at": 1760000000,
                        "company": {
                            "data": {
                                "id": "company-1"
                            }
                        },
                    },
                    "links": {
                        "public_url": "https://www.getonbrd.com/jobs/job-123"
                    },
                },
            ]
        }


class FakeAsyncClient:
    def __init__(self, *args, **kwargs):
        pass

    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc, tb):
        pass

    async def get(self, url):
        return FakeResponse()


@pytest.mark.anyio
async def test_fetch_jobs_removes_duplicate_external_ids(monkeypatch):
    monkeypatch.setattr(
        "app.services.jobs_service.httpx.AsyncClient",
        FakeAsyncClient,
    )

    jobs, metrics = await fetch_jobs(limit=20)

    assert len(jobs) == 1
    assert jobs[0].external_id == "job-123"

    assert metrics["total_received"] == 2
    assert metrics["valid"] == 1
    assert metrics["invalid"] == 0
    assert metrics["duplicates"] == 1
    assert metrics["processing_time_ms"] >= 0

@pytest.mark.anyio
async def test_fetch_jobs_counts_invalid_records(monkeypatch):
    class InvalidFakeResponse:
        def raise_for_status(self):
            pass

        def json(self):
            return {
                "data": [
                    {
                        "id": "",
                        "attributes": {
                            "title": "Oferta inválida"
                        },
                        "links": {},
                    },
                    {
                        "id": "job-456",
                        "attributes": {
                            "title": "",
                            "description": "Sin título",
                            "countries": ["Chile"],
                            "remote_modality": "fully_remote",
                            "remote": True,
                            "category_name": "Programming",
                            "company": {
                                "data": {
                                    "id": "company-2"
                                }
                            },
                        },
                        "links": {
                            "public_url": "https://www.getonbrd.com/jobs/job-456"
                        },
                    },
                    {
                        "id": "job-789",
                        "attributes": {
                            "title": "Frontend Developer",
                            "description": "Angular",
                            "countries": ["Chile"],
                            "remote_modality": "fully_remote",
                            "remote": True,
                            "category_name": "Programming",
                            "company": {
                                "data": {
                                    "id": "company-3"
                                }
                            },
                        },
                        "links": {
                            "public_url": "https://www.getonbrd.com/jobs/job-789"
                        },
                    },
                ]
            }

    class InvalidFakeAsyncClient:
        def __init__(self, *args, **kwargs):
            pass

        async def __aenter__(self):
            return self

        async def __aexit__(self, exc_type, exc, tb):
            pass

        async def get(self, url):
            return InvalidFakeResponse()

    monkeypatch.setattr(
        "app.services.jobs_service.httpx.AsyncClient",
        InvalidFakeAsyncClient,
    )

    jobs, metrics = await fetch_jobs(limit=20)

    assert len(jobs) == 1
    assert metrics["total_received"] == 3
    assert metrics["valid"] == 1
    assert metrics["invalid"] == 2
    assert metrics["duplicates"] == 0
    assert metrics["processing_time_ms"] >= 0

@pytest.mark.anyio
async def test_get_jobs_returns_504_on_timeout(monkeypatch):
    async def fake_fetch_jobs(limit):
        raise httpx.TimeoutException("timeout")

    monkeypatch.setattr(
        "app.main.fetch_jobs",
        fake_fetch_jobs,
    )

    with pytest.raises(HTTPException) as exc_info:
        await get_jobs(limit=20)

    assert exc_info.value.status_code == 504
    assert "Get on Board" in exc_info.value.detail
    assert "Traceback" not in exc_info.value.detail


@pytest.mark.anyio
async def test_get_jobs_returns_502_on_http_error(monkeypatch):
    request = httpx.Request(
        "GET",
        "https://www.getonbrd.com/api/test",
    )

    response = httpx.Response(
        status_code=500,
        request=request,
    )

    async def fake_fetch_jobs(limit):
        raise httpx.HTTPStatusError(
            "server error",
            request=request,
            response=response,
        )

    monkeypatch.setattr(
        "app.main.fetch_jobs",
        fake_fetch_jobs,
    )

    with pytest.raises(HTTPException) as exc_info:
        await get_jobs(limit=20)

    assert exc_info.value.status_code == 502
    assert "Get on Board" in exc_info.value.detail
    assert "Traceback" not in exc_info.value.detail


@pytest.mark.anyio
async def test_get_jobs_returns_502_on_connection_error(monkeypatch):
    request = httpx.Request(
        "GET",
        "https://www.getonbrd.com/api/test",
    )

    async def fake_fetch_jobs(limit):
        raise httpx.ConnectError(
            "connection failed",
            request=request,
        )

    monkeypatch.setattr(
        "app.main.fetch_jobs",
        fake_fetch_jobs,
    )

    with pytest.raises(HTTPException) as exc_info:
        await get_jobs(limit=20)

    assert exc_info.value.status_code == 502
    assert "Get on Board" in exc_info.value.detail
    assert "Traceback" not in exc_info.value.detail