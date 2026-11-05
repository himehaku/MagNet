import httpx

from fastapi import FastAPI
from pydantic import BaseModel
from fastapi import HTTPException
from app.services.jobs_service import fetch_jobs


app = FastAPI(
    title="MagNet Python Service",
    description="Servicio de compatibilidad laboral de MagNet",
    version="1.0.0",
)


class CompatibilityRequest(BaseModel):
    user_skills: list[str]
    job_skills: list[str]


@app.get("/")
def read_root():
    return {
        "message": "MagNet Python Service funcionando correctamente"
    }


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "python-service"
    }

@app.get("/jobs/fetch")
async def get_jobs(limit: int = 20):
    try:
        jobs = await fetch_jobs(limit)

        return {
            "source": "Get on Board",
            "count": len(jobs),
            "jobs": jobs,
        }

    except httpx.TimeoutException as exc:
        raise HTTPException(
            status_code=504,
            detail="Get on Board tardó demasiado en responder",
        ) from exc

    except httpx.HTTPStatusError as exc:
        raise HTTPException(
            status_code=502,
            detail="Get on Board respondió con un error",
        ) from exc

    except httpx.HTTPError as exc:
        raise HTTPException(
            status_code=502,
            detail="No fue posible conectar con Get on Board",
        ) from exc


@app.post("/compatibility")
def calculate_compatibility(data: CompatibilityRequest):
    user_skills = {
        skill.strip().lower()
        for skill in data.user_skills
    }

    job_skills = {
        skill.strip().lower()
        for skill in data.job_skills
    }

    if not job_skills:
        return {
            "compatibility": 0,
            "matched_skills": [],
            "missing_skills": []
        }

    matched_skills = sorted(user_skills & job_skills)
    missing_skills = sorted(job_skills - user_skills)

    compatibility = round(
        (len(matched_skills) / len(job_skills)) * 100,
        2
    )

    return {
        "compatibility": compatibility,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills
    }