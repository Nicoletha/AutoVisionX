"""
Tercer modelo de ML del sistema: pronóstico de precio del PRÓXIMO
lanzamiento del auto REAL (no el Hot Wheels), basado en la tendencia
histórica año vs precio de ese modelo.

Es distinto de price_service.py:
  - price_service.py: regresión "punto en el tiempo" -> dado un auto con
    año/kilometraje/condición/transmisión YA CONOCIDOS, estima su precio
    actual de mercado.
  - forecast_service.py (este módulo): regresión de TENDENCIA -> toma la
    serie histórica (año, precio promedio) de un modelo y extrapola hacia
    el siguiente año no observado todavía, usando regresión lineal simple
    sobre esa tendencia.

Fuente de datos: el mismo dataset sintético de price_dataset.py (documentado
ahí), agregado por año para obtener el precio promedio de mercado de cada
modelo en cada año simulado.
"""

from __future__ import annotations

import logging

import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score

from app.services.price_dataset import MODEL_PROFILES, generate_dataset

logger = logging.getLogger("autovisionx.forecast")


class ForecastService:
    def __init__(self) -> None:
        self._trends: dict[str, dict] = {}
        self._loaded = False

    def _ensure_loaded(self) -> None:
        if self._loaded:
            return

        df = generate_dataset()
        yearly_avg = (
            df.groupby(["real_car_model", "year"])["price"]
            .mean()
            .reset_index()
            .sort_values("year")
        )

        for model_name in MODEL_PROFILES:
            subset = yearly_avg[yearly_avg["real_car_model"] == model_name]
            if subset.empty:
                continue

            X = subset[["year"]].values.astype(float)
            y = subset["price"].values.astype(float)

            regressor = LinearRegression()
            regressor.fit(X, y)

            predictions = regressor.predict(X)
            r2 = float(r2_score(y, predictions)) if len(y) > 1 else 1.0

            self._trends[model_name] = {
                "regressor": regressor,
                "min_year": int(subset["year"].min()),
                "max_year": int(subset["year"].max()),
                "r2": r2,
            }
            logger.info(
                "Tendencia calculada para '%s': pendiente=$%.2f/año, R²=%.3f",
                model_name, regressor.coef_[0], r2,
            )

        self._loaded = True

    def predict_next_release(self, real_car_model: str, target_year: int | None = None) -> dict:
        self._ensure_loaded()

        if real_car_model not in self._trends:
            raise ValueError(f"No hay tendencia histórica registrada para '{real_car_model}'.")

        info = self._trends[real_car_model]
        next_year = target_year or (info["max_year"] + 1)

        predicted_price = float(info["regressor"].predict(np.array([[next_year]]))[0])
        slope_per_year = float(info["regressor"].coef_[0])

        return {
            "target_year": next_year,
            "predicted_price": round(max(0.0, predicted_price), 2),
            "trend_slope_per_year": round(slope_per_year, 2),
            "r_squared": round(info["r2"], 4),
            "based_on_year_from": info["min_year"],
            "based_on_year_to": info["max_year"],
        }

    def known_models(self) -> list[str]:
        return list(MODEL_PROFILES.keys())


forecast_service = ForecastService()