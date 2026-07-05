"""
Servicio de inferencia de la CNN entrenada desde cero (ver train_cnn.py).

Carga el checkpoint guardado en data/cnn_model/cnn_classifier.pt y expone
un método predict() con la misma forma (label, confidence) que usaba el
enfoque anterior por embeddings, para no romper el resto del pipeline
(color detection, umbral de reconocimiento, historial, etc.).
"""

from __future__ import annotations

import logging

import torch
import torch.nn.functional as F
from PIL import Image
from torchvision import transforms

from app.cnn.model import AutoVisionCNN
from app.cnn.train_cnn import CHECKPOINT_PATH, IMAGE_SIZE

logger = logging.getLogger("autovisionx.cnn.inference")

_INFERENCE_TRANSFORM = transforms.Compose([
    transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])


class CnnClassifierService:
    def __init__(self) -> None:
        self._model: AutoVisionCNN | None = None
        self._idx_to_class: dict[int, str] = {}
        self._device = "cuda" if torch.cuda.is_available() else "cpu"
        self._loaded = False

    def _ensure_loaded(self) -> None:
        if self._loaded:
            return

        if not CHECKPOINT_PATH.exists():
            logger.warning(
                "No existe un checkpoint entrenado en %s. "
                "Ejecuta 'python -m app.cnn.train_cnn' antes de usar el clasificador.",
                CHECKPOINT_PATH,
            )
            self._loaded = True
            return

        checkpoint = torch.load(CHECKPOINT_PATH, map_location=self._device)
        class_to_idx = checkpoint["class_to_idx"]
        self._idx_to_class = {v: k for k, v in class_to_idx.items()}

        model = AutoVisionCNN(num_classes=len(class_to_idx))
        model.load_state_dict(checkpoint["model_state"])
        model.to(self._device)
        model.eval()

        self._model = model
        self._loaded = True
        logger.info(
            "CNN cargada (%d clases, val_acc de entrenamiento=%.3f)",
            len(class_to_idx), checkpoint.get("best_val_acc", 0.0),
        )

    @torch.no_grad()
    def predict(self, image_path) -> tuple[str | None, float]:
        """Devuelve (class_label, confidence) o (None, 0.0) si no hay modelo entrenado."""
        self._ensure_loaded()

        if self._model is None:
            return None, 0.0

        image = Image.open(image_path).convert("RGB")
        tensor = _INFERENCE_TRANSFORM(image).unsqueeze(0).to(self._device)

        logits = self._model(tensor)
        probabilities = F.softmax(logits, dim=1).squeeze(0)

        confidence, predicted_idx = torch.max(probabilities, dim=0)
        predicted_label = self._idx_to_class.get(int(predicted_idx.item()))

        return predicted_label, float(confidence.item())

    def is_ready(self) -> bool:
        self._ensure_loaded()
        return self._model is not None

    def num_classes(self) -> int:
        self._ensure_loaded()
        return len(self._idx_to_class)


cnn_classifier_service = CnnClassifierService()