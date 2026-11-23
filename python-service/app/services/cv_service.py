from io import BytesIO

from pypdf import PdfReader


KNOWN_SKILLS = {
    "angular",
    "react",
    "vue",
    "typescript",
    "javascript",
    "python",
    "java",
    "c#",
    "c++",
    "php",
    "node.js",
    "nodejs",
    "nestjs",
    "express",
    "fastapi",
    "django",
    "flask",
    "spring",
    "spring boot",
    "sql",
    "postgresql",
    "mysql",
    "mongodb",
    "redis",
    "docker",
    "kubernetes",
    "aws",
    "azure",
    "gcp",
    "git",
    "github",
    "html",
    "css",
    "sass",
    "tailwind",
    "bootstrap",
    "rest",
    "graphql",
    "linux",
    "terraform",
}


def extract_text_from_pdf(content: bytes) -> str:
    reader = PdfReader(BytesIO(content))

    pages_text: list[str] = []

    for page in reader.pages:
        text = page.extract_text()

        if text:
            pages_text.append(text)

    return "\n".join(pages_text)


def detect_skills(text: str) -> list[str]:
    normalized_text = text.lower()

    detected = {
        skill
        for skill in KNOWN_SKILLS
        if skill in normalized_text
    }

    return sorted(detected)