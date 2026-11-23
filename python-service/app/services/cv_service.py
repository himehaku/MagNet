import re
from io import BytesIO

from pypdf import PdfReader

SKILL_PATTERNS: dict[str, list[str]] = {
    # Frontend
    "angular": [
        r"\bangular(?:js)?\b",
    ],
    "react": [
        r"\breact(?:\.js|js)?\b",
    ],
    "vue": [
        r"\bvue(?:\.js|js)?\b",
    ],
    "next.js": [
        r"\bnext\.?js\b",
    ],
    "nuxt": [
        r"\bnuxt(?:\.js|js)?\b",
    ],
    "svelte": [
        r"\bsvelte\b",
    ],
    "jquery": [
        r"\bjquery\b",
    ],

    # Languages
    "typescript": [
        r"\btypescript\b",
    ],
    "javascript": [
        r"\bjavascript\b",
    ],
    "python": [
        r"\bpython\b",
    ],
    "java": [
        r"\bjava\b",
    ],
    "c": [
        r"(?<![\w+#])c(?![\w+#])",
        r"\blenguaje\s+c\b",
        r"\bc\s+language\b",
    ],
    "c#": [
        r"(?<!\w)c#(?!\w)",
        r"\bcsharp\b",
    ],
    "c++": [
        r"(?<!\w)c\+\+(?!\w)",
        r"\bcpp\b",
    ],
    "go": [
        r"\bgolang\b",
    ],
    "php": [
        r"\bphp\b",
    ],
    "ruby": [
        r"\bruby\b",
    ],
    "kotlin": [
        r"\bkotlin\b",
    ],
    "swift": [
        r"\bswift\b",
    ],
    "rust": [
        r"\brust\b",
    ],
    "dart": [
        r"\bdart\b",
    ],
    "r": [
        r"\br\s+programming\b",
        r"\blenguaje\s+r\b",
    ],
    "scala": [
        r"\bscala\b",
    ],

    # Backend / frameworks
    "node.js": [
        r"\bnode\.?js\b",
        r"\bnodejs\b",
    ],
    "nestjs": [
        r"\bnest\.?js\b",
    ],
    "express": [
        r"\bexpress(?:\.js)?\b",
    ],
    "fastapi": [
        r"\bfastapi\b",
    ],
    "django": [
        r"\bdjango\b",
    ],
    "flask": [
        r"\bflask\b",
    ],
    "spring": [
        r"\bspring\b",
    ],
    "spring boot": [
        r"\bspring\s+boot\b",
    ],
    ".net": [
        r"(?<!\w)\.net\b",
        r"\bdotnet\b",
        r"\basp\.?net\b",
    ],
    "laravel": [
        r"\blaravel\b",
    ],
    "rails": [
        r"\bruby\s+on\s+rails\b",
        r"\brails\b",
    ],

    # Mobile
    "flutter": [
        r"\bflutter\b",
    ],
    "react native": [
        r"\breact\s+native\b",
    ],
    "ionic": [
        r"\bionic\b",
    ],
    "android": [
        r"\bandroid\b",
    ],
    "ios": [
        r"\bios\b",
    ],

    # Databases
    "sql": [
        r"\bsql\b",
    ],
    "postgresql": [
        r"\bpostgresql\b",
        r"\bpostgres\b",
    ],
    "mysql": [
        r"\bmysql\b",
    ],
    "mariadb": [
        r"\bmariadb\b",
    ],
    "mongodb": [
        r"\bmongodb\b",
    ],
    "redis": [
        r"\bredis\b",
    ],
    "oracle": [
        r"\boracle(?:\s+database)?\b",
    ],
    "sqlite": [
        r"\bsqlite\b",
    ],
    "dynamodb": [
        r"\bdynamodb\b",
    ],
    "elasticsearch": [
        r"\belasticsearch\b",
        r"\belastic\s*search\b",
    ],

    # DevOps / containers / infra
    "docker": [
        r"\bdocker\b",
    ],
    "docker compose": [
        r"\bdocker[\s-]compose\b",
        r"\bdocker\s+compose\b",
    ],
    "kubernetes": [
        r"\bkubernetes\b",
        r"\bk8s\b",
    ],
    "terraform": [
        r"\bterraform\b",
    ],
    "ansible": [
        r"\bansible\b",
    ],
    "helm": [
        r"\bhelm\b",
    ],
    "jenkins": [
        r"\bjenkins\b",
    ],
    "github actions": [
        r"\bgithub\s+actions\b",
    ],
    "gitlab ci": [
        r"\bgitlab\s+ci(?:/cd)?\b",
    ],
    "circleci": [
        r"\bcircleci\b",
    ],

    # Cloud
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
        r"\bgoogle cloud\b",
    ],
    "firebase": [
        r"\bfirebase\b",
    ],
    "supabase": [
        r"\bsupabase\b",
    ],
    "vercel": [
        r"\bvercel\b",
    ],
    "netlify": [
        r"\bnetlify\b",
    ],
    "digitalocean": [
        r"\bdigitalocean\b",
        r"\bdigital ocean\b",
    ],

    # Version control
    "git": [
        r"\bgit\b",
    ],
    "github": [
        r"\bgithub\b",
    ],
    "gitlab": [
        r"\bgitlab\b",
    ],
    "bitbucket": [
        r"\bbitbucket\b",
    ],

    # Web
    "html": [
        r"\bhtml5?\b",
    ],
    "css": [
        r"\bcss3?\b",
    ],
    "sass": [
        r"\bsass\b",
        r"\bscss\b",
    ],
    "tailwind": [
        r"\btailwind(?:css)?\b",
    ],
    "bootstrap": [
        r"\bbootstrap\b",
    ],

    # APIs / architecture
    "rest": [
        r"\brest\b",
        r"\brestful\b",
    ],
    "api": [
        r"\bapi\b",
        r"\bapis\b",
    ],
    "graphql": [
        r"\bgraphql\b",
    ],
    "grpc": [
        r"\bgrpc\b",
    ],
    "soap": [
        r"\bsoap\b",
    ],
    "swagger": [
        r"\bswagger\b",
    ],
    "openapi": [
        r"\bopenapi\b",
        r"\bopen api\b",
    ],
    "microservices": [
        r"\bmicroservices?\b",
        r"\bmicroservicios?\b",
    ],

    # Messaging
    "rabbitmq": [
        r"\brabbitmq\b",
    ],
    "kafka": [
        r"\bapache\s+kafka\b",
        r"\bkafka\b",
    ],

    # Automation / low-code
    "n8n": [
        r"\bn8n\b",
    ],
    "make": [
        r"\bmake\.com\b",
        r"\bintegromat\b",
    ],
    "zapier": [
        r"\bzapier\b",
    ],
    "power automate": [
        r"\bpower\s+automate\b",
    ],

    # CI/CD
    "ci/cd": [
        r"\bci\s*/\s*cd\b",
        r"\bcontinuous integration\b",
        r"\bcontinuous delivery\b",
        r"\bcontinuous deployment\b",
    ],

    # Security / authentication
    "oauth2": [
        r"\boauth\s*2(?:\.0)?\b",
        r"\boauth2\b",
    ],
    "oidc": [
        r"\boidc\b",
        r"\bopenid connect\b",
    ],
    "jwt": [
        r"\bjwt\b",
        r"\bjson web token\b",
    ],
    "owasp": [
        r"\bowasp\b",
    ],
    "keycloak": [
        r"\bkeycloak\b",
    ],

    # Testing
    "pytest": [
        r"\bpytest\b",
    ],
    "jest": [
        r"\bjest\b",
    ],
    "vitest": [
        r"\bvitest\b",
    ],
    "junit": [
        r"\bjunit\b",
    ],
    "cypress": [
        r"\bcypress\b",
    ],
    "playwright": [
        r"\bplaywright\b",
    ],
    "selenium": [
        r"\bselenium\b",
    ],
    "postman": [
        r"\bpostman\b",
    ],

    # Data / AI
    "pandas": [
        r"\bpandas\b",
    ],
    "numpy": [
        r"\bnumpy\b",
    ],
    "scikit-learn": [
        r"\bscikit[\s-]?learn\b",
        r"\bsklearn\b",
    ],
    "tensorflow": [
        r"\btensorflow\b",
    ],
    "pytorch": [
        r"\bpytorch\b",
        r"\btorch\b",
    ],
    "machine learning": [
        r"\bmachine learning\b",
        r"\baprendizaje automático\b",
    ],
    "artificial intelligence": [
        r"\bartificial intelligence\b",
        r"\binteligencia artificial\b",
    ],

    # BI / analytics
    "power bi": [
        r"\bpower\s*bi\b",
        r"\bpowerbi\b",
    ],
    "tableau": [
        r"\btableau\b",
    ],

    # Observability
    "observability": [
        r"\bobservability\b",
        r"\bobservabilidad\b",
    ],
    "prometheus": [
        r"\bprometheus\b",
    ],
    "grafana": [
        r"\bgrafana\b",
    ],
    "datadog": [
        r"\bdatadog\b",
    ],

    # Operating systems
    "linux": [
        r"\blinux\b",
    ],
    "windows": [
        r"\bwindows\b",
    ],

    # Project / collaboration
    "jira": [
        r"\bjira\b",
    ],
    "figma": [
        r"\bfigma\b",
    ],
    "scrum": [
        r"\bscrum\b",
    ],
    "agile": [
        r"\bagile\b",
        r"\bmetodolog[ií]as?\s+ágiles\b",
    ],
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