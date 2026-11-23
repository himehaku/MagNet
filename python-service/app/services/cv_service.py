import re
from io import BytesIO

from pypdf import PdfReader

SKILL_PATTERNS: dict[str, list[str]] = {
    "angular": [r"\bangular(?:js)?\b"],
    "react": [r"\breact(?:\.js|js)?\b"],
    "vue": [r"\bvue(?:\.js|js)?\b"],

    "typescript": [r"\btypescript\b"],
    "javascript": [r"\bjavascript\b"],
    "python": [r"\bpython\b"],
    "java": [r"\bjava\b"],
    "c#": [r"(?<!\w)c#(?!\w)"],
    "c++": [r"(?<!\w)c\+\+(?!\w)"],
    "go": [r"\bgo\b", r"\bgolang\b"],
    "php": [r"\bphp\b"],

    "node.js": [
        r"\bnode\.?js\b",
        r"\bnode\b",
    ],
    "nestjs": [r"\bnest\.?js\b"],
    "express": [r"\bexpress(?:\.js)?\b"],
    "fastapi": [r"\bfastapi\b"],
    "django": [r"\bdjango\b"],
    "flask": [r"\bflask\b"],
    "spring": [r"\bspring\b"],
    "spring boot": [r"\bspring\s+boot\b"],

    "sql": [r"\bsql\b"],
    "postgresql": [
        r"\bpostgresql\b",
        r"\bpostgres\b",
    ],
    "mysql": [r"\bmysql\b"],
    "mongodb": [r"\bmongodb\b"],
    "redis": [r"\bredis\b"],

    "docker": [r"\bdocker\b"],
    "kubernetes": [
        r"\bkubernetes\b",
        r"\bk8s\b",
    ],
    "terraform": [r"\bterraform\b"],

    "aws": [
        r"\baws\b",
        r"\bamazon web services\b",
    ],
    "azure": [
        r"\bazure\b",
        r"\bmicrosoft azure\b",
    ],
    "gcp": [
        r"\bgcp\b",
        r"\bgoogle cloud platform\b",
    ],

    "git": [r"\bgit\b"],
    "github": [r"\bgithub\b"],

    "html": [r"\bhtml5?\b"],
    "css": [r"\bcss3?\b"],
    "sass": [r"\bsass\b", r"\bscss\b"],
    "tailwind": [r"\btailwind(?:css)?\b"],
    "bootstrap": [r"\bbootstrap\b"],

    "rest": [
        r"\brest\b",
        r"\brestful\b",
    ],
    "api": [
        r"\bapi\b",
        r"\bapis\b",
    ],
    "graphql": [r"\bgraphql\b"],

    "microservices": [
        r"\bmicroservices?\b",
        r"\bmicroservicios?\b",
    ],

    "ci/cd": [
        r"\bci\s*/\s*cd\b",
        r"\bcontinuous integration\b",
        r"\bcontinuous delivery\b",
    ],

    "oauth2": [
        r"\boauth\s*2\b",
        r"\boauth2\b",
    ],
    "oidc": [
        r"\boidc\b",
        r"\bopenid connect\b",
    ],
    "jwt": [r"\bjwt\b"],
    "owasp": [r"\bowasp\b"],

    "observability": [
        r"\bobservability\b",
        r"\bobservabilidad\b",
    ],

    "linux": [r"\blinux\b"],
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

    detected: set[str] = set()

    for skill, patterns in SKILL_PATTERNS.items():
        if any(
            re.search(pattern, normalized_text)
            for pattern in patterns
        ):
            detected.add(skill)

    return sorted(detected)