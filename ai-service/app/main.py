import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router
from app.core.config import settings

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

app = FastAPI(
    title=settings.app_name,
    description=(
        "Microservicio de IA de AutoVisionX. Recibe imágenes desde el backend "
        "ASP.NET Core, genera embeddings visuales con CLIP, los compara contra "
        "el catálogo de Hot Wheels y detecta el color dominante en HEX."
    ),
    version="1.0.0",
)

# Solo el backend ASP.NET Core debe llamar a este servicio; se restringe
# el origen por defecto a localhost para desarrollo.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000", "https://localhost:5001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/")
def root():
    return {"service": settings.app_name, "status": "running"}
