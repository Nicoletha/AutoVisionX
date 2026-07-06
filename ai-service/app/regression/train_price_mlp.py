"""
Entrenamiento DESDE CERO de la red neuronal (MLP) que estima el precio
de mercado del auto real.

Uso:
    cd ai-service
    python -m app.regression.train_price_mlp

A diferencia de la CNN de clasificación (que usa fotografías), esta red
aprende sobre datos tabulares: marca, modelo, año, kilometraje, condición,
transmisión, número de dueños, historial de accidentes y modificaciones.
La fuente de esos datos es el dataset sintético documentado en
app/services/price_dataset.py.

NOTA DE DISEÑO IMPORTANTE: el catálogo mezcla autos de escalas de precio
muy distintas (desde ~$16,000 hasta ~$2,800,000). Entrenar directamente
sobre el precio en dólares hace que el error cuadrático (MSE) esté
dominado por los autos más caros, perjudicando la precisión relativa en
los autos económicos. Por eso el objetivo de entrenamiento es
log(1 + precio) en vez del precio directo: esto comprime la escala y
hace que la red aprenda igual de bien las variaciones proporcionales de
un Datsun de $16,000 que las de un Bugatti de $2,800,000. Al predecir,
se revierte la transformación (exp(pred) - 1) para volver a dólares.
"""

from __future__ import annotations

import copy
import logging

import numpy as np
import torch
import torch.nn as nn
from sklearn.compose import ColumnTransformer
from sklearn.metrics import mean_absolute_error
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from torch.utils.data import DataLoader, TensorDataset

from app.core.config import BASE_DIR
from app.regression.price_mlp_model import PriceMLP
from app.services.price_dataset import generate_dataset

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("autovisionx.regression.train")

CHECKPOINT_PATH = BASE_DIR / "data" / "price_model" / "price_mlp.pt"

CATEGORICAL_FEATURES = [
    "brand", "real_car_model", "condition", "transmission",
    "accident_history", "modifications",
]
NUMERIC_FEATURES = ["year", "mileage", "number_of_owners"]


def _build_preprocessor() -> ColumnTransformer:
    return ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), CATEGORICAL_FEATURES),
            ("num", StandardScaler(), NUMERIC_FEATURES),
        ]
    )


def train(epochs: int = 150, lr: float = 1e-3, batch_size: int = 32) -> None:
    device = "cuda" if torch.cuda.is_available() else "cpu"
    logger.info("Entrenando en dispositivo: %s", device)

    df = generate_dataset()
    X = df[CATEGORICAL_FEATURES + NUMERIC_FEATURES]

    # Objetivo en escala logarítmica (ver nota de diseño arriba).
    y_log = np.log1p(df["price"].values.astype(np.float64))

    X_train, X_val, y_train, y_val = train_test_split(X, y_log, test_size=0.2, random_state=42)

    preprocessor = _build_preprocessor()
    X_train_enc = preprocessor.fit_transform(X_train).astype(np.float32)
    X_val_enc = preprocessor.transform(X_val).astype(np.float32)

    y_mean, y_std = float(y_train.mean()), float(y_train.std())
    y_train_norm = (y_train - y_mean) / y_std
    y_val_norm = (y_val - y_mean) / y_std

    train_ds = TensorDataset(torch.tensor(X_train_enc), torch.tensor(y_train_norm, dtype=torch.float32))
    val_ds = TensorDataset(torch.tensor(X_val_enc), torch.tensor(y_val_norm, dtype=torch.float32))
    train_loader = DataLoader(train_ds, batch_size=batch_size, shuffle=True)
    val_loader = DataLoader(val_ds, batch_size=batch_size, shuffle=False)

    input_dim = X_train_enc.shape[1]
    model = PriceMLP(input_dim=input_dim).to(device)
    criterion = nn.MSELoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=lr, weight_decay=1e-5)

    best_val_mae = float("inf")
    best_state = copy.deepcopy(model.state_dict())

    for epoch in range(1, epochs + 1):
        model.train()
        running_loss, total = 0.0, 0
        for xb, yb in train_loader:
            xb, yb = xb.to(device), yb.to(device)
            optimizer.zero_grad()
            preds = model(xb)
            loss = criterion(preds, yb)
            loss.backward()
            optimizer.step()
            running_loss += loss.item() * xb.size(0)
            total += xb.size(0)

        train_loss = running_loss / total
        val_mae_usd = _evaluate_mae(model, val_loader, device, y_mean, y_std)

        if epoch % 10 == 0 or epoch == 1 or epoch == epochs:
            logger.info(
                "Época %03d/%d | train_loss(MSE log-norm)=%.4f | val_MAE=$%.2f",
                epoch, epochs, train_loss, val_mae_usd,
            )

        if val_mae_usd <= best_val_mae:
            best_val_mae = val_mae_usd
            best_state = copy.deepcopy(model.state_dict())

    CHECKPOINT_PATH.parent.mkdir(parents=True, exist_ok=True)
    torch.save(
        {
            "model_state": best_state,
            "input_dim": input_dim,
            "preprocessor": preprocessor,
            "y_mean": y_mean,
            "y_std": y_std,
            "best_val_mae": best_val_mae,
            "log_target": True,
            "categorical_features": CATEGORICAL_FEATURES,
            "numeric_features": NUMERIC_FEATURES,
        },
        CHECKPOINT_PATH,
    )
    logger.info("Mejor MAE de validación: $%.2f", best_val_mae)
    logger.info("Checkpoint guardado en: %s", CHECKPOINT_PATH)


@torch.no_grad()
def _evaluate_mae(model, loader, device, y_mean, y_std) -> float:
    model.eval()
    all_preds, all_targets = [], []
    for xb, yb in loader:
        xb = xb.to(device)
        preds_log = model(xb).cpu().numpy() * y_std + y_mean
        targets_log = yb.numpy() * y_std + y_mean
        # Revertir la transformación logarítmica para medir el error en dólares reales.
        preds_usd = np.expm1(preds_log)
        targets_usd = np.expm1(targets_log)
        all_preds.extend(preds_usd)
        all_targets.extend(targets_usd)
    return mean_absolute_error(all_targets, all_preds)


if __name__ == "__main__":
    train()