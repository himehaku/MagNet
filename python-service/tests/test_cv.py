from io import BytesIO

from fastapi.testclient import TestClient
from pypdf import PdfWriter

from app.main import app

client = TestClient(app)


def create_blank_pdf() -> bytes:
    writer = PdfWriter()
    writer.add_blank_page(width=300, height=300)

    buffer = BytesIO()
    writer.write(buffer)

    return buffer.getvalue()


def test_cv_rejects_non_pdf():
    response = client.post(
        "/cv/analyze",
        files={
            "file": (
                "cv.txt",
                b"Angular Python",
                "text/plain",
            )
        },
    )

    assert response.status_code == 400


def test_cv_rejects_empty_file():
    response = client.post(
        "/cv/analyze",
        files={
            "file": (
                "cv.pdf",
                b"",
                "application/pdf",
            )
        },
    )

    assert response.status_code == 400


def test_cv_without_extractable_text_returns_422():
    pdf = create_blank_pdf()

    response = client.post(
        "/cv/analyze",
        files={
            "file": (
                "cv.pdf",
                pdf,
                "application/pdf",
            )
        },
    )

    assert response.status_code == 422