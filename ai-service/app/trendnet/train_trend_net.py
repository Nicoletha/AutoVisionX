"""
Entrenamiento DESDE CERO de la red neuronal de tendencia (cuarta y
última red del proyecto).

Uso:
    cd ai-service
    python -m app.trendnet.train_trend_net
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
    X = df[CATEGORICAL_FEATURES + NUMERIC_FEATURES]
    y = df["price"].values.astype(np.float32)

    X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=42)

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
    model = TrendNet(input_dim=input_dim).to(device)
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
        val_mae = _evaluate_mae(model, val_loader, device, y_mean, y_std)

        if epoch % 10 == 0 or epoch == 1 or epoch == epochs:
            logger.info(
                "Época %03d/%d | train_loss(MSE norm)=%.4f | val_MAE=$%.2f",
                epoch, epochs, train_loss, val_mae,
            )

        if val_mae <= best_val_mae:
            best_val_mae = val_mae
            best_state = copy.deepcopy(model.state_dict())

    # R² y rango de años observado, por modelo (para reportar junto a cada proyección).
    model.load_state_dict(best_state)
    model.eval()
    r2_by_model: dict[str, float] = {}
    year_range_by_model: dict[str, tuple[int, int]] = {}

    with torch.no_grad():
        for model_name in MODEL_PROFILES:
            subset = df[df["real_car_model"] == model_name]
            enc = preprocessor.transform(subset[CATEGORICAL_FEATURES + NUMERIC_FEATURES]).astype(np.float32)
            preds_norm = model(torch.tensor(enc).to(device)).cpu().numpy()
            preds = preds_norm * y_std + y_mean
            r2_by_model[model_name] = float(r2_score(subset["price"], preds))
            year_range_by_model[model_name] = (int(subset["year"].min()), int(subset["year"].max()))

    CHECKPOINT_PATH.parent.mkdir(parents=True, exist_ok=True)
    torch.save(
        {
            "model_state": best_state,
            "input_dim": input_dim,
            "preprocessor": preprocessor,
            "y_mean": y_mean,
            "y_std": y_std,
            "best_val_mae": best_val_mae,
            "r2_by_model": r2_by_model,
            "year_range_by_model": year_range_by_model,
        },
        CHECKPOINT_PATH,
    )
    logger.info("Mejor MAE de validación: $%.2f", best_val_mae)
    logger.info("R² por modelo: %s", r2_by_model)
    logger.info("Checkpoint guardado en: %s", CHECKPOINT_PATH)


@torch.no_grad()
def _evaluate_mae(model, loader, device, y_mean, y_std) -> float:
    model.eval()
    all_preds, all_targets = [], []
    for xb, yb in loader:
        xb = xb.to(device)
        preds_usd = model(xb).cpu().numpy() * y_std + y_mean
        targets_usd = yb.numpy() * y_std + y_mean
        all_preds.extend(preds_usd)
        all_targets.extend(targets_usd)
    return mean_absolute_error(all_targets, all_preds)


if __name__ == "__main__":
    train()