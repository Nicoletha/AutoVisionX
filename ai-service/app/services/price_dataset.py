"""
Generador de dataset SINTÉTICO para el modelo de regresión de precio.

⚠ IMPORTANTE (documentar esto en la sustentación del proyecto):
No existe un dataset público con precios reales de mercado que cubra los
5 autos del MVP (algunos son autos exóticos: el Nissan Skyline GT-R R34
nunca se vendió oficialmente en EE.UU., el Lamborghini Huracán es un
superdeportivo de nicho). Los datasets públicos típicos de predicción de
precio de autos (Craigslist, CarDekho, etc.) no incluyen estos modelos.

Por eso este dataset se genera sintéticamente a partir de:
  - un precio de referencia aproximado de mercado por modelo (basado en
    rangos conocidos de compraventa / subastas de cada auto),
  - una curva de depreciación por kilometraje,
  - un multiplicador de condición del vehículo,
  - un ajuste por año (los autos "clásicos"/JDM tienden a apreciarse;
    los superdeportivos modernos se deprecian con el uso),
  - un pequeño ajuste por transmisión (manual suele valorarse más en
    autos deportivos/clásicos),
  - ruido aleatorio para simular variabilidad real de mercado.

Esto es una aproximación pedagógica para fines de demostración académica,
NO una fuente de valuación financiera real.
"""

from __future__ import annotations

import numpy as np
import pandas as pd

RANDOM_SEED = 42

# Precio de referencia aproximado (USD) para un ejemplar en condición
# "Buena", kilometraje moderado, año de referencia.
MODEL_PROFILES = {
    "Nissan Skyline GT-R (R34)": {
        "brand": "Nissan",
        "reference_price": 95_000,
        "reference_year": 2002,
        "reference_mileage": 60_000,
        # >0: se aprecia con la antigüedad (clásico JDM); <0: se deprecia.
        "age_appreciation_per_year": 900,
        "mileage_penalty_per_km": 0.35,
    },
    "Toyota Supra (A80)": {
        "brand": "Toyota",
        "reference_price": 55_000,
        "reference_year": 2000,
        "reference_mileage": 80_000,
        "age_appreciation_per_year": 500,
        "mileage_penalty_per_km": 0.25,
    },
    "Ford Mustang GT": {
        "brand": "Ford",
        "reference_price": 18_000,
        "reference_year": 1998,
        "reference_mileage": 120_000,
        "age_appreciation_per_year": 40,
        "mileage_penalty_per_km": 0.06,
    },
    "Lamborghini Huracán": {
        "brand": "Lamborghini",
        "reference_price": 220_000,
        "reference_year": 2017,
        "reference_mileage": 15_000,
        "age_appreciation_per_year": -6_000,  # se deprecia con la antigüedad
        "mileage_penalty_per_km": 1.8,
    },
    "Porsche 911 Carrera": {
        "brand": "Porsche",
        "reference_price": 95_000,
        "reference_year": 2019,
        "reference_mileage": 25_000,
        "age_appreciation_per_year": -1_500,
        "mileage_penalty_per_km": 0.5,
    },
}

CONDITION_MULTIPLIERS = {
    "Excelente": 1.15,
    "Buena": 1.0,
    "Regular": 0.82,
    "Mala": 0.60,
}

TRANSMISSION_ADJUSTMENT = {
    "Manual": 1.04,
    "Automática": 1.0,
}


def _simulate_row(model_name: str, rng: np.random.Generator) -> dict:
    profile = MODEL_PROFILES[model_name]

    year = int(rng.integers(profile["reference_year"] - 6, profile["reference_year"] + 6))
    mileage = max(0, int(rng.normal(profile["reference_mileage"], profile["reference_mileage"] * 0.35)))
    condition = rng.choice(list(CONDITION_MULTIPLIERS.keys()), p=[0.2, 0.45, 0.25, 0.1])
    transmission = rng.choice(list(TRANSMISSION_ADJUSTMENT.keys()), p=[0.55, 0.45])

    year_delta = year - profile["reference_year"]
    mileage_delta = mileage - profile["reference_mileage"]

    price = profile["reference_price"]
    price += year_delta * profile["age_appreciation_per_year"]
    price -= mileage_delta * profile["mileage_penalty_per_km"]
    price *= CONDITION_MULTIPLIERS[condition]
    price *= TRANSMISSION_ADJUSTMENT[transmission]

    # Ruido de mercado (+/- ~8%)
    noise = rng.normal(1.0, 0.08)
    price = max(2_000, price * noise)

    return {
        "brand": profile["brand"],
        "real_car_model": model_name,
        "year": year,
        "mileage": mileage,
        "condition": condition,
        "transmission": transmission,
        "price": round(price, 2),
    }


def generate_dataset(rows_per_model: int = 400, seed: int = RANDOM_SEED) -> pd.DataFrame:
    rng = np.random.default_rng(seed)
    rows = [
        _simulate_row(model_name, rng)
        for model_name in MODEL_PROFILES
        for _ in range(rows_per_model)
    ]
    return pd.DataFrame(rows)


if __name__ == "__main__":
    df = generate_dataset()
    print(df.groupby("real_car_model")["price"].describe())