"""
Detección de color dominante real a partir de la imagen analizada.

Estrategia:
  1) Cargar la imagen y opcionalmente recortar el centro (donde suele
     estar el auto) para reducir la influencia del fondo.
  2) Aplicar un filtro simple para descartar píxeles casi blancos/negros
     (fondo de estudio) cuando sea posible.
  3) Clustering KMeans sobre los píxeles restantes para hallar los
     colores dominantes (esto sigue siendo procesamiento de imagen puro,
     no una red neuronal: se necesita para saber CUÁLES píxeles
     representan el color del auto).
  4) Ordenar los clusters por tamaño: el más grande es el color principal,
     el resto son colores secundarios.
  5) Nombrar el color principal usando la red neuronal entrenada desde
     cero en app/colornet/ (reemplaza la antigua heurística de "color
     de referencia más cercano").
"""

from __future__ import annotations

from pathlib import Path

import cv2
import numpy as np
from sklearn.cluster import KMeans

from app.colornet.color_classifier_inference import color_classifier_service
from app.core.config import settings


def _rgb_to_hex(rgb: tuple[int, int, int]) -> str:
    r, g, b = (max(0, min(255, int(c))) for c in rgb)
    return f"#{r:02X}{g:02X}{b:02X}"


def _center_crop(image: np.ndarray, fraction: float = 0.7) -> np.ndarray:
    h, w = image.shape[:2]
    ch, cw = int(h * fraction), int(w * fraction)
    y0 = (h - ch) // 2
    x0 = (w - cw) // 2
    return image[y0 : y0 + ch, x0 : x0 + cw]


def _filter_background_pixels(pixels: np.ndarray) -> np.ndarray:
    """Descarta píxeles casi blancos o casi negros (fondo típico de estudio)."""
    brightness = pixels.mean(axis=1)
    mask = (brightness > 15) & (brightness < 245)
    filtered = pixels[mask]
    return filtered if len(filtered) > 50 else pixels


def detect_dominant_colors(image_path: str | Path, n_colors: int | None = None):
    """
    Devuelve (primary_hex, primary_name, secondary_hexes).

    El color principal se nombra con la red neuronal de app/colornet/
    (entrenada desde cero); los colores en sí se extraen con K-Means
    sobre los píxeles reales de la imagen.
    """
    n_colors = n_colors or settings.color_clusters

    image_bgr = cv2.imread(str(image_path))
    if image_bgr is None:
        raise ValueError(f"No se pudo leer la imagen en {image_path}")

    image_rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)
    cropped = _center_crop(image_rgb, fraction=0.7)

    pixels = cropped.reshape(-1, 3).astype(np.float32)
    pixels = _filter_background_pixels(pixels)

    k = min(n_colors, max(1, len(np.unique(pixels, axis=0))))
    kmeans = KMeans(n_clusters=k, n_init=4, random_state=42)
    labels = kmeans.fit_predict(pixels)

    counts = np.bincount(labels)
    order = np.argsort(-counts)  # de mayor a menor frecuencia

    centers = kmeans.cluster_centers_[order]
    primary_rgb = tuple(centers[0])
    secondary_rgbs = [tuple(c) for c in centers[1:]]

    primary_hex = _rgb_to_hex(primary_rgb)
    primary_name, _confidence = color_classifier_service.predict(primary_rgb)
    secondary_hexes = [_rgb_to_hex(c) for c in secondary_rgbs]

    return primary_hex, primary_name, secondary_hexes