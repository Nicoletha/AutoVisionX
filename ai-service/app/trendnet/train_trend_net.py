"""
Entrenamiento DESDE CERO de la red neuronal de tendencia (cuarta red del
proyecto).

Uso:
    cd ai-service
    python -m app.trendnet.train_trend_net

NOTA DE DISEÑO IMPORTANTE: en la primera versión de esta red, el precio
objetivo se normalizaba con una única media y desviación estándar
GLOBALES (calculadas sobre los 11 modelos juntos). Como el catálogo mezcla
precios de ~$16,000 (Datsun) hasta ~$2,800,000 (Bugatti), esa
normalización global hacía que el error de los modelos más caros dominara
por completo la función de pérdida, y la red terminaba sin aprender bien
la tendencia año a año de los modelos más económicos (R² cercano a cero
o negativo en varios de ellos).

La corrección: el precio objetivo se normaliza usando la media y
desviación estándar PROPIAS de cada modelo (normalización por grupo). Así,
sin importar si el modelo cuesta $16,000 o $2,800,000, su error de
entrenamiento queda en una escala comparable (~N(0,1) dentro de su propio
grupo), y la red puede aprender la forma de la tendencia de cada modelo
en pie de igualdad. Al predecir, se revierte la normalización usando la
media/desviación específicas del modelo consultado.
"""

from __future__ import annotations

import copy
import logging

import numpy as np
import torch
import torch.nn as nn
from sklearn.compose import ColumnTransformer
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from torch.utils.data import DataLoader, TensorDataset

from app.core.config import BASE_DIR
from app.services.price_dataset import MODEL_PROFILES, generate_dataset
from app.trendnet.trend_model import TrendNet

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("autovisionx.trendnet.train")

CHECKPOINT_PATH = BASE_DIR / "data" / "trend_model" / "trend_net.pt"

CATEGORICAL_FEATURES = ["real_car_model"]
NUMERIC_FEATURES = ["year"]


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

    # Normalización POR MODELO (ver nota de diseño arriba).
    price_mean_by_model = df.groupby("real_car_model")["price"].mean().to_dict()
    price_std_by_model = df.groupby("real_car_model")["price"].std().to_dict()

    row_mean = df["real_car_model"].map(price_mean_by_model).values.astype(np.float64)
    row_std = df["real_car_model"].map(price_std_by_model).values.astype(np.float64)
    y_norm_per_model = (df["price"].values.astype(np.float64) - row_mean) / row_std

    X = df[CATEGORICAL_FEATURES + NUMERIC_FEATURES]
    X_train, X_val, y_train, y_val = train_test_split(X, y_norm_per_model, test_size=0.2, random_state=42)

    preprocessor = _build_preprocessor()
    X_train_enc = preprocessor.fit_transform(X_train).astype(np.float32)
    X_val_enc = preprocessor.transform(X_val).astype(np.float32)

    train_ds = TensorDataset(torch.tensor(X_train_enc), torch.tensor(y_train, dtype=torch.float32))
    val_ds = TensorDataset(torch.tensor(X_val_enc), torch.tensor(y_val, dtype=torch.float32))
    train_loader = DataLoader(train_ds, batch_size=batch_size, shuffle=True)
    val_loader = DataLoader(val_ds, batch_size=batch_size, shuffle=False)

    input_dim = X_train_enc.shape[1]
    model = TrendNet(input_dim=input_dim).to(device)
    criterion = nn.MSELoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=lr, weight_decay=1e-5)

    best_val_loss = float("inf")
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
        val_loss = _evaluate_loss(model, val_loader, device, criterion)

        if epoch % 10 == 0 or epoch == 1 or epoch == epochs:
            logger.info(
                "Época %03d/%d | train_loss(MSE norm-por-modelo)=%.4f | val_loss=%.4f",
                epoch, epochs, train_loss, val_loss,
            )

        if val_loss <= best_val_loss:
            best_val_loss = val_loss
            best_state = copy.deepcopy(model.state_dict())

    # R² y rango de años observado, por modelo (para reportar junto a cada proyección).
    model.load_state_dict(best_state)
    model.eval()
    r2_by_model: dict[str, float] = {}
    mae_by_model: dict[str, float] = {}
    year_range_by_model: dict[str, tuple[int, int]] = {}

    with torch.no_grad():
        for model_name in MODEL_PROFILES:
            subset = df[df["real_car_model"] == model_name]
            enc = preprocessor.transform(subset[CATEGORICAL_FEATURES + NUMERIC_FEATURES]).astype(np.float32)
            preds_norm = model(torch.tensor(enc).to(device)).cpu().numpy()
            preds_usd = preds_norm * price_std_by_model[model_name] + price_mean_by_model[model_name]
            r2_by_model[model_name] = float(r2_score(subset["price"], preds_usd))
            mae_by_model[model_name] = float(mean_absolute_error(subset["price"], preds_usd))
            year_range_by_model[model_name] = (int(subset["year"].min()), int(subset["year"].max()))

    CHECKPOINT_PATH.parent.mkdir(parents=True, exist_ok=True)
    torch.save(
        {
            "model_state": best_state,
            "input_dim": input_dim,
            "preprocessor": preprocessor,
            "price_mean_by_model": price_mean_by_model,
            "price_std_by_model": price_std_by_model,
            "best_val_loss": best_val_loss,
            "r2_by_model": r2_by_model,
            "mae_by_model": mae_by_model,
            "year_range_by_model": year_range_by_model,
        },
        CHECKPOINT_PATH,
    )
    logger.info("R² por modelo: %s", {k: round(v, 3) for k, v in r2_by_model.items()})
    logger.info("MAE por modelo (USD): %s", {k: round(v, 2) for k, v in mae_by_model.items()})
    logger.info("Checkpoint guardado en: %s", CHECKPOINT_PATH)


@torch.no_grad()
def _evaluate_loss(model, loader, device, criterion) -> float:
    model.eval()
    total_loss, total = 0.0, 0
    for xb, yb in loader:
        xb, yb = xb.to(device), yb.to(device)
        preds = model(xb)
        loss = criterion(preds, yb)
        total_loss += loss.item() * xb.size(0)
        total += xb.size(0)
    return total_loss / total if total else 0.0


if __name__ == "__main__":
    train()