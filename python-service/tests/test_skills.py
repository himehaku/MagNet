from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_extract_skills_from_text():
    response = client.post(
        "/skills/extract",
        json={
            "text": (
                "Buscamos experiencia con Angular, "
                "TypeScript, NestJS y PostgreSQL."
            )
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert "angular" in data["skills"]
    assert "typescript" in data["skills"]
    assert "nestjs" in data["skills"]
    assert "postgresql" in data["skills"]


def test_extract_skills_rejects_empty_text():
    response = client.post(
        "/skills/extract",
        json={
            "text": "   ",
        },
    )

    assert response.status_code == 400