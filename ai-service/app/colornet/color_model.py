"""
Red neuronal (MLP pequeña) entrenada DESDE CERO para clasificar el
nombre de un color a partir de sus 3 valores RGB.

Es la tercera red neuronal del proyecto (junto a la CNN de clasificación
de modelos y la MLP de precio), y reemplaza la heurística original que
solo buscaba el color de referencia más cercano por distancia euclidiana.
A diferencia de esa heurística fija, la red aprende fronteras de decisión
no lineales entre categorías de color a partir de datos.
"""

from __future__ import annotations

import torch.nn as nn


class ColorClassifierNet(nn.Module):
    def __init__(self, num_classes: int) -> None:
        super().__init__()
        self.network = nn.Sequential(
            nn.Linear(3, 32),
            nn.ReLU(),
            nn.Linear(32, 32),
            nn.ReLU(),
            nn.Linear(32, num_classes),
        )

    def forward(self, x):
        return self.network(x)