import pytest

from app.services.jobs_service import fetch_jobs


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