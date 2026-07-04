"""
Servicio de embeddings visuales basado en CLIP.

Enfoque (según especificación del proyecto):
  1) Fase catálogo: cada Hot Wheels tiene entre 10 y 20 imágenes de referencia
     en data/catalog/<class_label>/*.jpg. Se calcula el embedding de cada una
     y se guarda un promedio (centroide) por clase en data/embeddings/index.npz
  2) Fase inferencia: se genera el embedding de la imagen del usuario y se
     compara (similitud coseno) contra cada centroide del catálogo.

No requiere entrenamiento: CLIP ya viene preentrenado y generaliza bien
para comparación por similitud visual.
"""

from __future__ import annotations

import logging
from pathlib import Path

import numpy as np
import torch
from PIL import Image

from app.core.config import settings

logger = logging.getLogger("autovisionx.embeddings")

_VALID_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}


class EmbeddingService:
    def __init__(self) -> None:
        self._device = "cuda" if torch.cuda.is_available() else "cpu"
        self._model = None
        self._preprocess = None
        self._class_centroids: dict[str, np.ndarray] = {}
        self._loaded = False

    def _lazy_load_model(self) -> None:
        if self._model is not None:
            return
        import open_clip

        logger.info("Cargando modelo CLIP (%s / %s) en %s...",
                    settings.clip_model_name, settings.clip_pretrained, self._device)
        model, _, preprocess = open_clip.create_model_and_transforms(
            settings.clip_model_name, pretrained=settings.clip_pretrained
        )
        model.eval().to(self._device)
        self._model = model
        self._preprocess = preprocess
        logger.info("Modelo CLIP listo.")

    def _embed_image(self, image: Image.Image) -> np.ndarray:
        self._lazy_load_model()
        tensor = self._preprocess(image.convert("RGB")).unsqueeze(0).to(self._device)
        with torch.no_grad():
            features = self._model.encode_image(tensor)
            features = features / features.norm(dim=-1, keepdim=True)
        return features.squeeze(0).cpu().numpy()

    def embed_path(self, image_path: str | Path) -> np.ndarray:
        image = Image.open(image_path)
        return self._embed_image(image)

    # ---------- Catálogo ----------

    def build_catalog_index(self) -> dict[str, int]:
        """
        Recorre data/catalog/<class_label>/ , calcula embeddings de cada
        imagen de referencia y guarda el centroide (promedio normalizado)
        de cada clase en data/embeddings/index.npz

        Ejecutar cuando se agreguen o cambien las imágenes de referencia:
            python -m app.embeddings.build_catalog
        """
        counts: dict[str, int] = {}
        centroids: dict[str, np.ndarray] = {}

        for class_dir in sorted(settings.catalog_dir.iterdir()):
            if not class_dir.is_dir():
                continue
            class_label = class_dir.name
            images = [
                p for p in class_dir.iterdir()
                if p.suffix.lower() in _VALID_EXTENSIONS
            ]
            if not images:
                logger.warning("Sin imágenes de referencia para '%s'. Se omite.", class_label)
                continue

            embeddings = [self.embed_path(p) for p in images]
            centroid = np.mean(embeddings, axis=0)
            centroid = centroid / np.linalg.norm(centroid)

            centroids[class_label] = centroid
            counts[class_label] = len(images)
            logger.info("Clase '%s': %d imágenes procesadas.", class_label, len(images))

        settings.embeddings_dir.mkdir(parents=True, exist_ok=True)
        np.savez(settings.embeddings_dir / "index.npz", **centroids)
        self._class_centroids = centroids
        self._loaded = True
        return counts

    def _load_index(self) -> None:
        index_path = settings.embeddings_dir / "index.npz"
        if not index_path.exists():
            logger.warning(
                "No existe %s todavía. Ejecuta build_catalog_index() primero. "
                "Se usará un catálogo vacío (todo se marcará como no reconocido).",
                index_path,
            )
            self._class_centroids = {}
            self._loaded = True
            return

        data = np.load(index_path)
        self._class_centroids = {k: data[k] for k in data.files}
        self._loaded = True

    def match(self, image_path: str | Path) -> tuple[str | None, float]:
        """Devuelve (class_label, similarity_score) del mejor match, o (None, 0.0)."""
        if not self._loaded:
            self._load_index()

        if not self._class_centroids:
            return None, 0.0

        query_embedding = self.embed_path(image_path)

        best_label = None
        best_score = -1.0
        for label, centroid in self._class_centroids.items():
            score = float(np.dot(query_embedding, centroid))  # ambos ya normalizados
            if score > best_score:
                best_score = score
                best_label = label

        return best_label, best_score


embedding_service = EmbeddingService()
