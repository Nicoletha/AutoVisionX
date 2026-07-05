"""
Red neuronal (MLP pequeña) entrenada DESDE CERO para proyectar el precio
del PRÓXIMO lanzamiento de un modelo, en reemplazo del LinearRegression
de scikit-learn usado inicialmente en forecast_service.py.

Es la cuarta y última red neuronal del proyecto. A diferencia de una
regresión lineal (que ajusta una sola recta por modelo), esta red recibe
el modelo (codificado One-Hot) y el año como entrada, y puede aprender
una tendencia distinta para cada modelo dentro de una misma red, en vez
de entrenar 5 regresiones lineales separadas.
"""

from __future__ import annotations

import torch.nn as nn


class TrendNet(nn.Module):
    def __init__(self, input_dim: int) -> None:
        super().__init__()
        self.network = nn.Sequential(
            nn.Linear(input_dim, 64),
            nn.ReLU(),
            nn.Linear(64, 32),
            nn.ReLU(),
            nn.Linear(32, 1),
        )

    def forward(self, x):
        return self.network(x).squeeze(-1)