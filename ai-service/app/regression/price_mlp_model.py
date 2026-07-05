"""
Red neuronal feedforward (MLP - Multi-Layer Perceptron) entrenada DESDE
CERO para estimar el precio de mercado del auto real, en reemplazo del
RandomForestRegressor usado inicialmente.

Al igual que la CNN de clasificación (ver app/cnn/), los pesos de esta
red parten de inicialización aleatoria: no se reutiliza ningún modelo
preentrenado. Las características categóricas (marca, modelo, condición,
transmisión, accidentes, modificaciones) se codifican con One-Hot antes
de entrar a la red, y las numéricas (año, kilometraje, número de dueños)
se normalizan; ambas transformaciones se calculan con scikit-learn, pero
el modelo de regresión en sí es la red neuronal, entrenada por completo
en este proyecto.
"""

from __future__ import annotations

import torch.nn as nn


class PriceMLP(nn.Module):
    def __init__(self, input_dim: int) -> None:
        super().__init__()
        self.network = nn.Sequential(
            nn.Linear(input_dim, 128),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(128, 64),
            nn.ReLU(),
            nn.Dropout(0.1),
            nn.Linear(64, 32),
            nn.ReLU(),
            nn.Linear(32, 1),
        )

    def forward(self, x):
        return self.network(x).squeeze(-1)