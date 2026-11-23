import httpx
from fastapi import FastAPI, File, HTTPException, UploadFile
from pydantic import BaseModel
from typing import Annotated

from app.services.cv_service import (
    detect_skills,
    extract_text_from_pdf,
)
from app.services.jobs_service import fetch_jobs

app = FastAPI(
    title="MagNet Python Service",
    description="Servicio de compatibilidad laboral de MagNet",
    version="1.0.0",
)


class CompatibilityRequest(BaseModel):
    user_skills: list[str]
    job_skills: list[str]

class SkillExtractionRequest(BaseModel):
    text: str

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
        jobs, metrics = await fetch_jobs(limit)

        return {
            "source": "Get on Board",
            "count": len(jobs),
            "jobs": jobs,
            "metrics": metrics,
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

@app.post("/skills/extract")
def extract_skills(data: SkillExtractionRequest):
    text = data.text.strip()

    if not text:
        raise HTTPException(
            status_code=400,
            detail="El texto no puede estar vacío",
        )

    skills = detect_skills(text)

    return {
        "skills": skills,
        "skills_count": len(skills),
    }

@app.post("/compatibility")
def calculate_compatibility(data: CompatibilityRequest):
    user_skills = {
        normalized
        for skill in data.user_skills
        if (normalized := skill.strip().lower())
    }

    job_skills = {
        normalized
        for skill in data.job_skills
        if (normalized := skill.strip().lower())
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

@app.post("/cv/analyze")
async def analyze_cv(
    file: Annotated[UploadFile, File(...)],
):
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="El archivo debe ser un PDF",
        )

    content = await file.read()

    if not content:
        raise HTTPException(
            status_code=400,
            detail="El archivo está vacío",
        )

    max_size = 5 * 1024 * 1024

    if len(content) > max_size:
        raise HTTPException(
            status_code=413,
            detail="El archivo supera el límite de 5 MB",
        )

    try:
        text = extract_text_from_pdf(content)
    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail="No fue posible procesar el PDF",
        ) from exc

    if not text.strip():
        raise HTTPException(
            status_code=422,
            detail="No fue posible extraer texto del CV",
        )

    skills = detect_skills(text)

    return {
        "filename": file.filename,
        "skills": skills,
        "skills_count": len(skills),
        "requires_confirmation": True,
    }