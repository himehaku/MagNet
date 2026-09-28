from fastapi import FastAPI

app = FastAPI(
    title="MagNet API",
    description="API del servicio de compatibilidad laboral de MagNet",
    version="1.0.0",
)


@app.get("/")
def read_root():
    return {"message": "MagNet API funcionando correctamente"}


@app.get("/health")
def health_check():
    return {"status": "ok"}