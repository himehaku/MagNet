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

    jobs = await fetch_jobs(limit=20)

    assert len(jobs) == 1
    assert jobs[0].external_id == "job-123"
