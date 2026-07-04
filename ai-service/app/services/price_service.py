"""
Servicio de REGRESIÓN para estimar el precio de mercado del auto REAL
representado por el Hot Wheels detectado (no el precio del Hot Wheels).

Es un modelo completamente aparte del de clasificación por embeddings:
  - Clasificación (embedding_service.py): identifica QUÉ modelo es, a
    partir de una imagen.
  - Regresión (este módulo): estima CUÁNTO valdría ese auto real en el
    mercado, a partir de características tabulares (año, kilometraje,
    condición, transmisión) que el usuario ingresa en el frontend.

El modelo se entrena una sola vez sobre el dataset sintético de
price_dataset.py y se cachea en disco con joblib para no reentrenar en
cada arranque del servicio.
"""

from __future__ import annotations

import logging
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder

from app.core.config import BASE_DIR
from app.services.price_dataset import (
    CONDITION_MULTIPLIERS,
    MODEL_PROFILES,
    TRANSMISSION_ADJUSTMENT,
    generate_dataset,
)

logger = logging.getLogger("autovisionx.price")

MODEL_ARTIFACT_PATH = BASE_DIR / "data" / "price_model" / "price_regressor.joblib"

CATEGORICAL_FEATURES = ["brand", "real_car_model", "condition", "transmission"]
NUMERIC_FEATURES = ["year", "mileage"]


class PriceService:
    def __init__(self) -> None:
        self._pipeline: Pipeline | None = None
        self._mae: float | None = None

    def _build_pipeline(self) -> Pipeline:
        preprocessor = ColumnTransformer(
            transformers=[
                ("cat", OneHotEncoder(handle_unknown="ignore"), CATEGORICAL_FEATURES),
            ],
            remainder="passthrough",  # deja pasar year, mileage tal cual
        )
        model = RandomForestRegressor(
            n_estimators=300,
            max_depth=12,
            random_state=42,
            n_jobs=-1,
        )
        return Pipeline(steps=[("preprocessor", preprocessor), ("model", model)])

    def train(self, save: bool = True) -> float:
        """Entrena el regresor sobre el dataset sintético y devuelve el MAE de validación."""
        df = generate_dataset()
        X = df[CATEGORICAL_FEATURES + NUMERIC_FEATURES]
        y = df["price"]

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )

        pipeline = self._build_pipeline()
        pipeline.fit(X_train, y_train)

        predictions = pipeline.predict(X_test)
        mae = mean_absolute_error(y_test, predictions)

        logger.info("Regresor de precio entrenado. MAE de validación: $%.2f", mae)

        self._pipeline = pipeline
        self._mae = mae

        if save:
            MODEL_ARTIFACT_PATH.parent.mkdir(parents=True, exist_ok=True)
            joblib.dump({"pipeline": pipeline, "mae": mae}, MODEL_ARTIFACT_PATH)

        return mae

    def _ensure_loaded(self) -> None:
        if self._pipeline is not None:
            return

        if MODEL_ARTIFACT_PATH.exists():
            logger.info("Cargando regresor de precio desde caché: %s", MODEL_ARTIFACT_PATH)
            artifact = joblib.load(MODEL_ARTIFACT_PATH)
            self._pipeline = artifact["pipeline"]
            self._mae = artifact["mae"]
        else:
            logger.info("No hay modelo de precio cacheado. Entrenando uno nuevo...")
            self.train(save=True)

    def predict(
        self,
        real_car_model: str,
        brand: str,
        year: int,
        mileage: int,
        condition: str,
        transmission: str,
    ) -> dict:
        self._ensure_loaded()
        assert self._pipeline is not None

        if condition not in CONDITION_MULTIPLIERS:
            condition = "Buena"
        if transmission not in TRANSMISSION_ADJUSTMENT:
            transmission = "Automática"

        row = pd.DataFrame([{
            "brand": brand,
            "real_car_model": real_car_model,
            "condition": condition,
            "transmission": transmission,
            "year": year,
            "mileage": mileage,
        }])

        estimated_price = float(self._pipeline.predict(row)[0])
        margin = float(self._mae or estimated_price * 0.12)

        return {
            "estimated_price": round(max(0.0, estimated_price), 2),
            "price_range_low": round(max(0.0, estimated_price - margin), 2),
            "price_range_high": round(estimated_price + margin, 2),
            "currency": "USD",
            "model_mae": round(margin, 2),
        }

    def known_models(self) -> list[str]:
        return list(MODEL_PROFILES.keys())


price_service = PriceService()