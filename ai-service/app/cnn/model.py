"""
Arquitectura de red neuronal convolucional (CNN) entrenada DESDE CERO
para clasificar los 5 modelos de Hot Wheels del MVP.

A diferencia de un enfoque por embeddings con un modelo preentrenado
(transfer learning), aquí los pesos de la red parten de inicialización
aleatoria y se ajustan únicamente con las imágenes del catálogo propio
del proyecto (data/catalog/<clase>/*.jpg).

Arquitectura: 4 bloques convolucionales (Conv2d + BatchNorm + ReLU +
MaxPool) seguidos de Global Average Pooling y una capa totalmente
conectada de clasificación. Es una CNN pequeña, deliberadamente simple,
adecuada para un dataset de tamaño reducido como el de este proyecto.
"""

from __future__ import annotations

import torch.nn as nn

IMAGE_SIZE = 128


class AutoVisionCNN(nn.Module):
    def __init__(self, num_classes: int) -> None:
        super().__init__()

        self.features = nn.Sequential(
            # Bloque 1: 128x128x3 -> 64x64x32
            nn.Conv2d(3, 32, kernel_size=3, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2),

            # Bloque 2: 64x64x32 -> 32x32x64
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2),

            # Bloque 3: 32x32x64 -> 16x16x128
            nn.Conv2d(64, 128, kernel_size=3, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2),

            # Bloque 4: 16x16x128 -> 8x8x256
            nn.Conv2d(128, 256, kernel_size=3, padding=1),
            nn.BatchNorm2d(256),
            nn.ReLU(inplace=True),
            nn.AdaptiveAvgPool2d(1),  # Global Average Pooling -> 1x1x256
        )

        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Dropout(0.3),
            nn.Linear(256, num_classes),
        )

    def forward(self, x):
        x = self.features(x)
        return self.classifier(x)