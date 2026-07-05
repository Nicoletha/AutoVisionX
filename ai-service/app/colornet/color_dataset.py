"""
Dataset SINTÉTICO para entrenar el clasificador de color (tercera red
neuronal del proyecto).

¿Por qué sintético? Etiquetar manualmente miles de fotos con su color
exacto sería inviable para un proyecto de este alcance. En su lugar, se
generan muestras RGB sintéticas alrededor de un color de referencia por
categoría (los mismos 11 colores que ya usaba la heurística anterior),
simulando la variación real que introduce la iluminación, las sombras y
la calidad de la cámara: ruido gaussiano en cada canal + variaciones de
brillo. Esto le enseña a la red a reconocer la categoría de color aunque
el tono exacto capturado no sea idéntico al de referencia.
"""

from __future__ import annotations

import numpy as np

# Mismos 11 colores de referencia que antes usaba la heurística de
# distancia euclidiana (ver color_service.py).
COLOR_CLASSES: list[tuple[str, tuple[int, int, int]]] = [
    ("Rojo", (180, 30, 30)),
    ("Naranja", (230, 126, 34)),
    ("Amarillo", (230, 210, 40)),
    ("Verde", (39, 174, 96)),
    ("Azul", (41, 84, 168)),
    ("Morado", (110, 60, 160)),
    ("Rosa", (220, 90, 150)),
    ("Blanco", (245, 245, 245)),
    ("Gris", (140, 140, 140)),
    ("Negro", (25, 25, 25)),
    ("Café", (110, 70, 40)),
]

CLASS_NAMES = [name for name, _ in COLOR_CLASSES]


def _simulate_samples(reference_rgb: tuple[int, int, int], n: int, rng: np.random.Generator) -> np.ndarray:
    """Genera n muestras RGB alrededor de un color de referencia."""
    base = np.array(reference_rgb, dtype=np.float32)

    # Ruido de color por canal (simula variación de cámara/JPEG).
    channel_noise = rng.normal(0, 14, size=(n, 3))

    # Variación de brillo global (simula iluminación más fuerte/débil).
    brightness_factor = rng.normal(1.0, 0.12, size=(n, 1))

    samples = base[None, :] * brightness_factor + channel_noise
    return np.clip(samples, 0, 255)


def generate_dataset(samples_per_class: int = 300, seed: int = 42) -> tuple[np.ndarray, np.ndarray]:
    """
    Devuelve (X, y):
      X: matriz (N, 3) de valores RGB normalizados a [0, 1]
      y: vector (N,) de índices de clase (0..len(COLOR_CLASSES)-1)
    """
    rng = np.random.default_rng(seed)

    X_parts, y_parts = [], []
    for class_idx, (_, reference_rgb) in enumerate(COLOR_CLASSES):
        samples = _simulate_samples(reference_rgb, samples_per_class, rng)
        X_parts.append(samples)
        y_parts.append(np.full(samples_per_class, class_idx))

    X = np.vstack(X_parts).astype(np.float32) / 255.0
    y = np.concatenate(y_parts).astype(np.int64)

    # Mezclar para que el entrenamiento no vea las clases en bloques.
    shuffle_idx = rng.permutation(len(X))
    return X[shuffle_idx], y[shuffle_idx]


if __name__ == "__main__":
    X, y = generate_dataset()
    print("Shape X:", X.shape, "Shape y:", y.shape)
    print("Clases:", CLASS_NAMES)