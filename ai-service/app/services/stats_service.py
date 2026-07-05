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


def _clean_feature_name(raw_name: str) -> str:
    """Convierte nombres técnicos a algo más legible."""
    name = raw_name.split("__", 1)[-1]
    return name.replace("_", " ")


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

        std_price = float(prices.std())
        if np.isnan(std_price):
            std_price = 0.0

        return {
            "sample_count": int(len(subset)),
            "mean_price": round(float(prices.mean()), 2),
            "median_price": round(float(prices.median()), 2),
            "min_price": round(float(prices.min()), 2),
            "max_price": round(float(prices.max()), 2),
            "std_price": round(std_price, 2),
            "distribution": distribution,
        }

    def price_feature_importance(self, sample_size: int = 60) -> list[dict]:
        """
        Importancia de cada característica en la red neuronal (MLP) de precio,
        calculada por permutación.
        """
        from sklearn.metrics import mean_absolute_error
        from app.regression.price_mlp_inference import price_mlp_service
        from app.regression.train_price_mlp import (
            CATEGORICAL_FEATURES,
            NUMERIC_FEATURES,
        )

        price_mlp_service._ensure_loaded()

        df = self._ensure_data()
        sample = df.sample(
            n=min(sample_size, len(df)),
            random_state=42
        ).reset_index(drop=True)

        features = CATEGORICAL_FEATURES + NUMERIC_FEATURES

        def batch_predict(frame: pd.DataFrame) -> list[float]:
            return [
                price_mlp_service.predict(
                    real_car_model=row.real_car_model,
                    brand=row.brand,
                    year=int(row.year),
                    mileage=int(row.mileage),
                    condition=row.condition,
                    transmission=row.transmission,
                    number_of_owners=int(row.number_of_owners),
                    accident_history=row.accident_history,
                    modifications=row.modifications,
                )["estimated_price"]
                for row in frame.itertuples()
            ]

        baseline_preds = batch_predict(sample)
        baseline_mae = mean_absolute_error(sample["price"], baseline_preds)

        rng = np.random.default_rng(42)
        raw_importances = []

        for feature in features:
            shuffled = sample.copy()
            shuffled[feature] = rng.permutation(shuffled[feature].values)
            preds = batch_predict(shuffled)
            mae = mean_absolute_error(sample["price"], preds)
            raw_importances.append((feature, max(0.0, mae - baseline_mae)))

        total = sum(v for _, v in raw_importances) or 1.0

        return [
            {
                "feature": _clean_feature_name(f),
                "importance": round(v / total, 4),
            }
            for f, v in sorted(raw_importances, key=lambda x: -x[1])
        ]

    def forecast_stats(self, real_car_model: str) -> dict:
        """Estadísticas descriptivas + serie histórica año -> precio promedio."""
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

        std_price = float(subset["price"].std())
        if np.isnan(std_price):
            std_price = 0.0

        return {
            "sample_count": int(len(subset)),
            "year_count": int(len(yearly)),
            "mean_price": round(float(subset["price"].mean()), 2),
            "median_price": round(float(subset["price"].median()), 2),
            "min_price": round(float(subset["price"].min()), 2),
            "max_price": round(float(subset["price"].max()), 2),
            "std_price": round(std_price, 2),
            "yearly_averages": yearly_points,
        }


stats_service = StatsService()