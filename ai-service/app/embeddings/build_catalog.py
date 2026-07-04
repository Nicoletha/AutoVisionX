"""
Script de utilidad para generar el índice de embeddings del catálogo.

Uso:
    cd ai-service
    python -m app.embeddings.build_catalog

Requiere que existan imágenes de referencia (10-20 por modelo) dentro de:
    data/catalog/skyline_r34/*.jpg
    data/catalog/toyota_supra/*.jpg
    data/catalog/ford_mustang/*.jpg
    data/catalog/lamborghini_huracan/*.jpg
    data/catalog/porsche_911/*.jpg
"""

import logging

from app.services.embedding_service import embedding_service

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")


def main() -> None:
    counts = embedding_service.build_catalog_index()
    if not counts:
        print(
            "\n⚠ No se encontraron imágenes en data/catalog/<clase>/. "
            "Agrega entre 10 y 20 fotos de referencia por modelo y vuelve a ejecutar este script.\n"
        )
        return

    print("\nÍndice de catálogo generado correctamente:")
    for label, n in counts.items():
        print(f"  - {label}: {n} imágenes")
    print(f"\nGuardado en: data/embeddings/index.npz\n")


if __name__ == "__main__":
    main()
