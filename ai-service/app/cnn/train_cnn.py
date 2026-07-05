"""
Entrenamiento DESDE CERO de la CNN de clasificación de Hot Wheels.

Uso:
    cd ai-service
    python -m app.cnn.train_cnn

Requiere que existan imágenes de referencia dentro de:
    data/catalog/skyline_r34/*.jpg
    data/catalog/toyota_supra/*.jpg
    data/catalog/ford_mustang/*.jpg
    data/catalog/lamborghini_huracan/*.jpg
    data/catalog/porsche_911/*.jpg

Con datasets pequeños (10-30 imágenes por clase), el sobreajuste es el
riesgo principal. Para mitigarlo se aplica data augmentation agresivo
(recorte aleatorio, flip horizontal, rotación, jitter de color) durante
el entrenamiento, y se valida contra un split de validación separado en
cada época, guardando solo el mejor checkpoint según precisión de validación.
"""

from __future__ import annotations

import copy
import json
import logging
from pathlib import Path

import torch
import torch.nn as nn
from torch.utils.data import DataLoader, random_split
from torchvision import datasets, transforms

from app.cnn.model import IMAGE_SIZE, AutoVisionCNN
from app.core.config import settings

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("autovisionx.cnn.train")

CHECKPOINT_PATH = settings.embeddings_dir.parent / "cnn_model" / "cnn_classifier.pt"

TRAIN_TRANSFORM = transforms.Compose([
    transforms.RandomResizedCrop(IMAGE_SIZE, scale=(0.75, 1.0)),
    transforms.RandomHorizontalFlip(),
    transforms.RandomRotation(15),
    transforms.ColorJitter(brightness=0.25, contrast=0.25, saturation=0.25),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

VAL_TRANSFORM = transforms.Compose([
    transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])


def _build_dataloaders(batch_size: int = 8):
    full_dataset = datasets.ImageFolder(str(settings.catalog_dir))

    if len(full_dataset) == 0:
        raise RuntimeError(
            f"No se encontraron imágenes en {settings.catalog_dir}. "
            "Agrega fotos de referencia por clase antes de entrenar."
        )

    val_size = max(1, int(0.2 * len(full_dataset)))
    train_size = len(full_dataset) - val_size
    train_subset, val_subset = random_split(full_dataset, [train_size, val_size])

    # random_split no aplica transform distinto por split, así que lo
    # asignamos manualmente después de la partición.
    train_subset.dataset = datasets.ImageFolder(str(settings.catalog_dir), transform=TRAIN_TRANSFORM)
    val_subset.dataset = datasets.ImageFolder(str(settings.catalog_dir), transform=VAL_TRANSFORM)

    train_loader = DataLoader(train_subset, batch_size=batch_size, shuffle=True)
    val_loader = DataLoader(val_subset, batch_size=batch_size, shuffle=False)

    return train_loader, val_loader, full_dataset.class_to_idx


def train(epochs: int = 30, lr: float = 1e-3, batch_size: int = 8) -> None:
    device = "cuda" if torch.cuda.is_available() else "cpu"
    logger.info("Entrenando en dispositivo: %s", device)

    train_loader, val_loader, class_to_idx = _build_dataloaders(batch_size)
    num_classes = len(class_to_idx)
    logger.info("Clases detectadas (%d): %s", num_classes, class_to_idx)

    model = AutoVisionCNN(num_classes=num_classes).to(device)
    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=lr, weight_decay=1e-4)

    best_val_acc = 0.0
    best_state = copy.deepcopy(model.state_dict())

    for epoch in range(1, epochs + 1):
        model.train()
        running_loss, running_correct, total = 0.0, 0, 0

        for images, labels in train_loader:
            images, labels = images.to(device), labels.to(device)

            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            running_loss += loss.item() * images.size(0)
            running_correct += (outputs.argmax(1) == labels).sum().item()
            total += images.size(0)

        train_loss = running_loss / total
        train_acc = running_correct / total

        val_acc = _evaluate(model, val_loader, device)

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
            "class_to_idx": class_to_idx,
            "image_size": IMAGE_SIZE,
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
    for images, labels in loader:
        images, labels = images.to(device), labels.to(device)
        outputs = model(images)
        correct += (outputs.argmax(1) == labels).sum().item()
        total += images.size(0)
    return correct / total if total else 0.0


if __name__ == "__main__":
    train()