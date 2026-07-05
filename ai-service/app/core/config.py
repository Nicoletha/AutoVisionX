from pathlib import Path
from pydantic_settings import BaseSettings

BASE_DIR = Path(__file__).resolve().parent.parent.parent


class Settings(BaseSettings):
    """Configuración central del servicio de IA.

    Todos los valores pueden sobreescribirse con variables de entorno,
    por ejemplo: SIMILARITY_THRESHOLD=0.6
    """

    app_name: str = "AutoVisionX AI Service"

    # CLIP: modelo preentrenado usado para generar embeddings visuales.
    clip_model_name: str = "ViT-B-32"
    clip_pretrained: str = "openai"

    # Rutas de datos
    catalog_dir: Path = BASE_DIR / "data" / "catalog"
    embeddings_dir: Path = BASE_DIR / "data" / "embeddings"
    temp_dir: Path = BASE_DIR / "data" / "temp"

    # Umbral mínimo de similitud coseno para considerar un match válido.
    similarity_threshold: float = 0.40

    # Número de colores para el clustering KMeans de color dominante.
    color_clusters: int = 3

    class Config:
        env_file = ".env"


settings = Settings()

settings.catalog_dir.mkdir(parents=True, exist_ok=True)
settings.embeddings_dir.mkdir(parents=True, exist_ok=True)
settings.temp_dir.mkdir(parents=True, exist_ok=True)
