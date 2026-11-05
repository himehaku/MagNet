from datetime import datetime, timezone
import re

import httpx

from app.models.job import Job


GETONBOARD_URL = (
    "https://www.getonbrd.com/api/v0/categories/programming/jobs"
)


def clean_text(value: str | None) -> str:
    if not value:
        return ""

    value = re.sub(r"<[^>]+>", " ", value)
    value = re.sub(r"\s+", " ", value)

    return value.strip()


def normalize_location(
    countries: list[str] | None,
    remote_modality: str | None,
) -> str | None:
    parts: list[str] = []

    if countries:
        parts.append(", ".join(countries))

    modality_names = {
        "fully_remote": "Remoto",
        "remote_local": "Remoto local",
        "hybrid": "Híbrido",
        "no_remote": "Presencial",
    }

    if remote_modality:
        modality = modality_names.get(
            remote_modality,
            remote_modality,
        )
        parts.append(modality)

    if not parts:
        return None

    return " - ".join(parts)


async def fetch_jobs(limit: int = 20) -> list[Job]:
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(GETONBOARD_URL)
        response.raise_for_status()

    payload = response.json()

    jobs_data = payload.get("data", [])

    jobs: list[Job] = []
    seen_ids: set[str] = set()

    for item in jobs_data:
        if len(jobs) >= limit:
            break

        job_id = str(item.get("id", "")).strip()

        if not job_id or job_id in seen_ids:
            continue

        attributes = item.get("attributes", {})
        links = item.get("links", {})

        title = clean_text(attributes.get("title"))

        if not title:
            continue

        source_url = links.get("public_url")

        if not source_url:
            continue

        description = clean_text(
            attributes.get("description")
        )

        countries = attributes.get("countries", [])

        remote_modality = attributes.get(
            "remote_modality"
        )

        location = normalize_location(
            countries,
            remote_modality,
        )

        published_timestamp = attributes.get(
            "published_at"
        )

        published_at = None

        if published_timestamp:
            published_at = datetime.fromtimestamp(
                published_timestamp,
                tz=timezone.utc,
            )

        company_data = (
            attributes
            .get("company", {})
            .get("data", {})
        )

        company_id = company_data.get("id")

        company_name = (
            f"Empresa #{company_id}"
            if company_id
            else "Empresa no especificada"
        )

        jobs.append(
            Job(
                external_id=job_id,
                title=title,
                company=company_name,
                description=description,
                location=location,
                remote=bool(
                    attributes.get("remote")
                ),
                category=attributes.get(
                    "category_name"
                ),
                source="Get on Board",
                source_url=source_url,
                published_at=published_at,
                fetched_at=datetime.now(
                    timezone.utc
                ),
            )
        )

        seen_ids.add(job_id)

    return jobs