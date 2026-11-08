from datetime import datetime

from pydantic import BaseModel, Field, HttpUrl


class Job(BaseModel):
    external_id: str = Field(min_length=1)
    title: str = Field(min_length=1)
    company: str = Field(min_length=1)
    description: str
    location: str | None = None
    remote: bool | None = None
    category: str | None = None
    source: str = Field(min_length=1)
    source_url: HttpUrl
    published_at: datetime | None = None
    fetched_at: datetime