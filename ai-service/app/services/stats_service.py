"""
Estadísticas descriptivas del dataset usado por los modelos de regresión
de precio (price_service.py) y de tendencia (forecast_service.py).

Esto es puramente informativo/transparencia para la sustentación del
proyecto: permite mostrar con qué datos se entrenó cada modelo y qué tan
importante fue cada característica en la predicción.
"""

from __future__ import annotations

import numpy as np
import pandas as pd

from app.services.price_dataset import generate_dataset
from app.services.price_service import price_service


class StatsService:
    def __init__(self) -> None:
        self._df: pd.DataFrame | None = None

    def _ensure_data(self) -> pd.DataFrame:
        if self._df is None:
            self._df = generate_dataset()
        return self._df

    def price_stats(self, real_car_model: str) -> dict:
        """Estadísticas descriptivas + histograma de precios para un modelo."""
        df = self._ensure_data()
        subset = df[df["real_car_model"] == real_car_model]

        if subset.empty:
            raise ValueError(f"No hay datos registrados para '{real_car_model}'.")

        prices = subset["price"]
        hist_counts, hist_edges = np.histogram(prices, bins=8)

        distribution = [
            {
                "range_low": round(float(hist_edges[i]), 2),
                "range_high": round(float(hist_edges[i + 1]), 2),
                "count": int(hist_counts[i]),
            }
            for i in range(len(hist_counts))
        ]

        return {
            "sample_count": int(len(subset)),
            "mean_price": round(float(prices.mean()), 2),
            "median_price": round(float(prices.median()), 2),
            "min_price": round(float(prices.min()), 2),
            "max_price": round(float(prices.max()), 2),
            "std_price": round(float(prices.std()), 2),
            "distribution": distribution,
        }

    def price_feature_importance(self) -> list[dict]:
        """
        Importancia de cada característica en el RandomForestRegressor
        (marca, modelo, condición, transmisión, año, kilometraje).
        """
        price_service._ensure_loaded()
        pipeline = price_service._pipeline
        preprocessor = pipeline.named_steps["preprocessor"]
        model = pipeline.named_steps["model"]

        feature_names = list(preprocessor.get_feature_names_out())
        importances = model.feature_importances_

        pairs = sorted(zip(feature_names, importances), key=lambda x: -x[1])
        return [
            {"feature": _clean_feature_name(name), "importance": round(float(imp), 4)}
            for name, imp in pairs
        ]

    def forecast_stats(self, real_car_model: str) -> dict:
        """Estadísticas descriptivas + serie histórica año->precio promedio."""
        df = self._ensure_data()
        subset = df[df["real_car_model"] == real_car_model]

        if subset.empty:
            raise ValueError(f"No hay datos registrados para '{real_car_model}'.")

        yearly = (
            subset.groupby("year")["price"]
            .mean()
            .reset_index()
            .sort_values("year")
        )
        yearly_points = [
            {"year": int(row.year), "avg_price": round(float(row.price), 2)}
            for row in yearly.itertuples()
        ]

        return {
            "sample_count": int(len(subset)),
            "year_count": int(len(yearly)),
            "mean_price": round(float(subset["price"].mean()), 2),
            "median_price": round(float(subset["price"].median()), 2),
            "min_price": round(float(subset["price"].min()), 2),
            "max_price": round(float(subset["price"].max()), 2),
            "std_price": round(float(subset["price"].std()), 2),
            "yearly_averages": yearly_points,
        }


def _clean_feature_name(raw_name: str) -> str:
    """Convierte 'cat__real_car_model_Ford Mustang GT' en algo más legible."""
    name = raw_name.split("__", 1)[-1]
    return name.replace("_", " ")


stats_service = StatsService()