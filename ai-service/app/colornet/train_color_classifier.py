"""
Entrenamiento DESDE CERO del clasificador de color (tercera red neuronal
del proyecto).

Uso:
    cd ai-service
    python -m app.colornet.train_color_classifier
"""

from __future__ import annotations

import copy
import logging

import numpy as np
import torch
import torch.nn as nn
from sklearn.model_selection import train_test_split
from torch.utils.data import DataLoader, TensorDataset

from app.colornet.color_dataset import CLASS_NAMES, generate_dataset
from app.colornet.color_model import ColorClassifierNet
from app.core.config import BASE_DIR

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("autovisionx.colornet.train")

CHECKPOINT_PATH = BASE_DIR / "data" / "color_model" / "color_classifier.pt"


def train(epochs: int = 60, lr: float = 1e-3, batch_size: int = 32) -> None:
    device = "cuda" if torch.cuda.is_available() else "cpu"
    logger.info("Entrenando en dispositivo: %s", device)

    X, y = generate_dataset()
    X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    train_ds = TensorDataset(torch.tensor(X_train), torch.tensor(y_train))
    val_ds = TensorDataset(torch.tensor(X_val), torch.tensor(y_val))
    train_loader = DataLoader(train_ds, batch_size=batch_size, shuffle=True)
    val_loader = DataLoader(val_ds, batch_size=batch_size, shuffle=False)

    model = ColorClassifierNet(num_classes=len(CLASS_NAMES)).to(device)
    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=lr, weight_decay=1e-5)

    best_val_acc = 0.0
    best_state = copy.deepcopy(model.state_dict())

    for epoch in range(1, epochs + 1):
        model.train()
        running_loss, correct, total = 0.0, 0, 0
        for xb, yb in train_loader:
            xb, yb = xb.to(device), yb.to(device)
            optimizer.zero_grad()
            outputs = model(xb)
            loss = criterion(outputs, yb)
            loss.backward()
            optimizer.step()

            running_loss += loss.item() * xb.size(0)
            correct += (outputs.argmax(1) == yb).sum().item()
            total += xb.size(0)

        train_loss = running_loss / total
        train_acc = correct / total
        val_acc = _evaluate(model, val_loader, device)

        if epoch % 5 == 0 or epoch == 1 or epoch == epochs:
            logger.info(
                "Época %02d/%d | loss=%.4f | train_acc=%.3f | val_acc=%.3f",
                epoch, epochs, train_loss, train_acc, val_acc,
            )

        if val_acc >= best_val_acc:
            best_val_acc = val_acc
            best_state = copy.deepcopy(model.state_dict())

    CHECKPOINT_PATH.parent.mkdir(parents=True, exist_ok=True)
    torch.save(
        {
            "model_state": best_state,
            "class_names": CLASS_NAMES,
            "best_val_acc": best_val_acc,
        },
        CHECKPOINT_PATH,
    )
    logger.info("Mejor precisión de validación: %.3f", best_val_acc)
    logger.info("Checkpoint guardado en: %s", CHECKPOINT_PATH)


@torch.no_grad()
def _evaluate(model: nn.Module, loader: DataLoader, device: str) -> float:
    model.eval()
    correct, total = 0, 0
    for xb, yb in loader:
        xb, yb = xb.to(device), yb.to(device)
        outputs = model(xb)
        correct += (outputs.argmax(1) == yb).sum().item()
        total += xb.size(0)
    return correct / total if total else 0.0


if __name__ == "__main__":
    train()