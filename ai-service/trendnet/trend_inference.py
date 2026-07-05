"""
Servicio de inferencia de la red neuronal de tendencia (ver
train_trend_net.py). Reemplaza a forecast_service.py (LinearRegression),
manteniendo la misma interfaz pública (predict_next_release) para no
romper el endpoint /forecast-next-release.
"""

from __future__ import annotations

import logging

import numpy as np
import pandas as pd
import torch

from app.services.price_dataset import MODEL_PROFILES
from app.trendnet.trend_model import TrendNet
from app.trendnet.train_trend_net import (
    CATEGORICAL_FEATURES,
    CHECKPOINT_PATH,
    NUMERIC_FEATURES,
    train as train_trend_net,
)

logger = logging.getLogger("autovisionx.trendnet.inference")


class TrendNetService:
    def __init__(self) -> None:
        self._model: TrendNet | None = None
        self._preprocessor = None
        self._y_mean = 0.0
        self._y_std = 1.0
        self._r2_by_model: dict[str, float] = {}
        self._year_range_by_model: dict[str, tuple[int, int]] = {}
        self._device = "cuda" if torch.cuda.is_available() else "cpu"
        self._loaded = False

    def _ensure_loaded(self) -> None:
        if self._loaded:
            return

        if not CHECKPOINT_PATH.exists():
            logger.info("No hay red de tendencia entrenada todavía. Entrenando una nueva...")
            train_trend_net()

        checkpoint = torch.load(CHECKPOINT_PATH, map_location=self._device, weights_only=False)

        model = TrendNet(input_dim=checkpoint["input_dim"])
        model.load_state_dict(checkpoint["model_state"])
        model.to(self._device)
        model.eval()

        self._model = model
        self._preprocessor = checkpoint["preprocessor"]
        self._y_mean = checkpoint["y_mean"]
        self._y_std = checkpoint["y_std"]
        self._r2_by_model = checkpoint["r2_by_model"]
        self._year_range_by_model = checkpoint["year_range_by_model"]
        self._loaded = True
        logger.info("Red de tendencia cargada. MAE de validación: $%.2f", checkpoint["best_val_mae"])

    def _predict_price_for_year(self, real_car_model: str, year: int) -> float:
        row = pd.DataFrame([{"real_car_model": real_car_model, "year": year}])
        encoded = self._preprocessor.transform(row[CATEGORICAL_FEATURES + NUMERIC_FEATURES]).astype(np.float32)
        tensor = torch.tensor(encoded).to(self._device)
        with torch.no_grad():
            pred_norm = self._model(tensor).cpu().numpy()[0]
        return float(pred_norm * self._y_std + self._y_mean)

    def predict_next_release(self, real_car_model: str, target_year: int | None = None) -> dict:
        self._ensure_loaded()

        if real_car_model not in self._year_range_by_model:
            raise ValueError(f"No hay tendencia histórica registrada para '{real_car_model}'.")

        min_year, max_year = self._year_range_by_model[real_car_model]
        next_year = target_year or (max_year + 1)

        predicted_price = self._predict_price_for_year(real_car_model, next_year)

        # Pendiente local: diferencia entre la predicción en next_year y en next_year - 1
        # (la red no es lineal, así que la "pendiente" se aproxima localmente).
        price_prev_year = self._predict_price_for_year(real_car_model, next_year - 1)
        slope_per_year = predicted_price - price_prev_year

        return {
            "target_year": next_year,
            "predicted_price": round(max(0.0, predicted_price), 2),
            "trend_slope_per_year": round(slope_per_year, 2),
            "r_squared": round(self._r2_by_model.get(real_car_model, 0.0), 4),
            "based_on_year_from": min_year,
            "based_on_year_to": max_year,
        }

    def known_models(self) -> list[str]:
        return list(MODEL_PROFILES.keys())


trend_net_service = TrendNetService()