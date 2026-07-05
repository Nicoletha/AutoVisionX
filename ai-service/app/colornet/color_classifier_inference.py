from __future__ import annotations

import logging

import numpy as np
import torch
import torch.nn.functional as F

from app.colornet.color_model import ColorClassifierNet
from app.colornet.train_color_classifier import CHECKPOINT_PATH, train as train_color_classifier

logger = logging.getLogger("autovisionx.colornet.inference")


class ColorClassifierService:
    def __init__(self) -> None:
        self._model: ColorClassifierNet | None = None
        self._class_names: list[str] = []
        self._device = "cuda" if torch.cuda.is_available() else "cpu"
        self._loaded = False

    def _ensure_loaded(self) -> None:
        if self._loaded:
            return

        if not CHECKPOINT_PATH.exists():
            logger.info("No hay clasificador de color entrenado todavía. Entrenando uno nuevo...")
            train_color_classifier()

        checkpoint = torch.load(CHECKPOINT_PATH, map_location=self._device, weights_only=False)

        model = ColorClassifierNet(num_classes=len(checkpoint["class_names"]))
        model.load_state_dict(checkpoint["model_state"])
        model.to(self._device)
        model.eval()

        self._model = model
        self._class_names = checkpoint["class_names"]
        self._loaded = True
        logger.info(
            "Clasificador de color cargado (%d clases, val_acc=%.3f)",
            len(self._class_names), checkpoint.get("best_val_acc", 0.0),
        )

    @torch.no_grad()
    def predict(self, rgb: tuple[int, int, int]) -> tuple[str, float]:
        """Devuelve (nombre_del_color, confianza) para un valor RGB (0-255)."""
        self._ensure_loaded()
        assert self._model is not None

        x = np.array(rgb, dtype=np.float32).reshape(1, 3) / 255.0
        tensor = torch.tensor(x).to(self._device)

        logits = self._model(tensor)
        probabilities = F.softmax(logits, dim=1).squeeze(0)
        confidence, predicted_idx = torch.max(probabilities, dim=0)

        return self._class_names[int(predicted_idx.item())], float(confidence.item())


color_classifier_service = ColorClassifierService()