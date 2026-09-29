from fastapi import FastAPI
from pydantic import BaseModel

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