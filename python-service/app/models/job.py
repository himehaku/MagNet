from datetime import datetime

from pydantic import BaseModel, HttpUrl


class Job(BaseModel):
    external_id: str
    title: str
    company: str
    description: str
    location: str | None = None
    remote: bool | None = None
    category: str | None = None
    source: str
    source_url: HttpUrl
    published_at: datetime | None = None
    fetched_at: datetime