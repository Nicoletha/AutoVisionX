"""
Servicio de inferencia de la red neuronal (MLP) de precio, entrenada
desde cero (ver train_price_mlp.py). Reemplaza al antiguo enfoque con
RandomForestRegressor, manteniendo la misma interfaz pública (predict)
para no romper el resto del pipeline (endpoint /predict-price, DTOs, etc.).
"""

from __future__ import annotations

import logging

import numpy as np
import pandas as pd
import torch

from app.regression.price_mlp_model import PriceMLP
from app.regression.train_price_mlp import (
    CATEGORICAL_FEATURES,
    CHECKPOINT_PATH,
    NUMERIC_FEATURES,
    train as train_price_mlp,
)
from app.services.price_dataset import (
    ACCIDENT_HISTORY_ADJUSTMENT,
    CONDITION_MULTIPLIERS,
    MODEL_PROFILES,
    MODIFICATIONS_ADJUSTMENT,
    TRANSMISSION_ADJUSTMENT,
)

logger = logging.getLogger("autovisionx.regression.inference")


class PriceMlpService:
    def __init__(self) -> None:
        self._model: PriceMLP | None = None
        self._preprocessor = None
        self._y_mean = 0.0
        self._y_std = 1.0
        self._best_val_mae = 0.0
        self._device = "cuda" if torch.cuda.is_available() else "cpu"
        self._loaded = False

    def _ensure_loaded(self) -> None:
        if self._loaded:
            return

        if not CHECKPOINT_PATH.exists():
            logger.info("No hay MLP de precio entrenada todavía. Entrenando una nueva...")
            train_price_mlp()

        checkpoint = torch.load(CHECKPOINT_PATH, map_location=self._device, weights_only=False)

        model = PriceMLP(input_dim=checkpoint["input_dim"])
        model.load_state_dict(checkpoint["model_state"])
        model.to(self._device)
        model.eval()

        self._model = model
        self._preprocessor = checkpoint["preprocessor"]
        self._y_mean = checkpoint["y_mean"]
        self._y_std = checkpoint["y_std"]
        self._best_val_mae = checkpoint["best_val_mae"]
        self._loaded = True
        logger.info("MLP de precio cargada. MAE de validación: $%.2f", self._best_val_mae)

    @torch.no_grad()
    def predict(
        self,
        real_car_model: str,
        brand: str,
        year: int,
        mileage: int,
        condition: str,
        transmission: str,
        number_of_owners: int = 1,
        accident_history: str = "No",
        modifications: str = "De fábrica",
    ) -> dict:
        self._ensure_loaded()
        assert self._model is not None

        if condition not in CONDITION_MULTIPLIERS:
            condition = "Buena"
        if transmission not in TRANSMISSION_ADJUSTMENT:
            transmission = "Automática"
        if accident_history not in ACCIDENT_HISTORY_ADJUSTMENT:
            accident_history = "No"
        if modifications not in MODIFICATIONS_ADJUSTMENT:
            modifications = "De fábrica"
        number_of_owners = max(1, min(5, int(number_of_owners)))

        row = pd.DataFrame([{
            "brand": brand,
            "real_car_model": real_car_model,
            "condition": condition,
            "transmission": transmission,
            "accident_history": accident_history,
            "modifications": modifications,
            "year": year,
            "mileage": mileage,
            "number_of_owners": number_of_owners,
        }])

        encoded = self._preprocessor.transform(row[CATEGORICAL_FEATURES + NUMERIC_FEATURES]).astype(np.float32)
        tensor = torch.tensor(encoded).to(self._device)

        pred_norm = self._model(tensor).cpu().numpy()[0]
        pred_log = float(pred_norm * self._y_std + self._y_mean)
        # Revertir la transformación log(1 + precio) usada durante el entrenamiento.
        estimated_price = float(np.expm1(pred_log))
        margin = float(self._best_val_mae or estimated_price * 0.12)

        return {
            "estimated_price": round(max(0.0, estimated_price), 2),
            "price_range_low": round(max(0.0, estimated_price - margin), 2),
            "price_range_high": round(estimated_price + margin, 2),
            "currency": "USD",
            "model_mae": round(margin, 2),
        }

    def known_models(self) -> list[str]:
        return list(MODEL_PROFILES.keys())


price_mlp_service = PriceMlpService()