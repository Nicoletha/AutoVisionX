import logging
import shutil
import uuid
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, Query, UploadFile

from app.core.config import settings
from app.models.schemas import (
    ForecastStatsResponse,
    HealthResponse,
    NextReleaseForecastRequest,
    NextReleaseForecastResponse,
    PriceDatasetStats,
    PriceDistributionBucket,
    PricePredictionRequest,
    PricePredictionResponse,
    PriceStatsResponse,
    PredictionResponse,
    FeatureImportanceItem,
    YearlyAveragePoint,
)
from app.services.color_service import detect_dominant_colors
from app.services.embedding_service import embedding_service
from app.services.forecast_service import forecast_service
from app.services.price_service import price_service
from app.services.stats_service import stats_service

logger = logging.getLogger("autovisionx.api")
router = APIRouter()

_ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp"}


@router.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    if not embedding_service._loaded:
        embedding_service._load_index()
    return HealthResponse(status="ok", catalog_classes=len(embedding_service._class_centroids))


@router.post("/predict", response_model=PredictionResponse, response_model_by_alias=True)
async def predict(image: UploadFile = File(...)) -> PredictionResponse:
    """
    Único endpoint que consume el backend ASP.NET Core.

    Flujo:
      1) Guarda temporalmente la imagen recibida.
      2) Genera su embedding con CLIP y lo compara contra el catálogo.
      3) Detecta el color dominante (HEX) sobre la misma imagen.
      4) Devuelve el resultado combinado.
    """
    if image.content_type not in _ALLOWED_CONTENT_TYPES:
        raise HTTPException(status_code=400, detail="Formato de imagen no soportado.")

    temp_path: Path = settings.temp_dir / f"{uuid.uuid4()}_{image.filename}"
    try:
        with temp_path.open("wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

        predicted_label, similarity_score = embedding_service.match(temp_path)
        recognized = predicted_label is not None and similarity_score >= settings.similarity_threshold

        primary_hex, primary_name, secondary_hexes = detect_dominant_colors(temp_path)

        return PredictionResponse(
            predictedLabel=predicted_label or "unrecognized",
            similarityScore=round(similarity_score, 4) if similarity_score > 0 else 0.0,
            detectedPrimaryColorHex=primary_hex,
            detectedPrimaryColorName=primary_name,
            secondaryColors=secondary_hexes,
            recognized=recognized,
        )
    except Exception as exc:  # noqa: BLE001
        logger.exception("Error procesando la imagen")
        raise HTTPException(status_code=500, detail="No se pudo procesar la imagen.") from exc
    finally:
        temp_path.unlink(missing_ok=True)


@router.post("/predict-price", response_model=PricePredictionResponse, response_model_by_alias=True)
def predict_price(payload: PricePredictionRequest) -> PricePredictionResponse:
    """
    Modelo de REGRESIÓN independiente del de clasificación.

    Estima el valor de mercado del auto REAL (no el Hot Wheels) a partir
    de marca, modelo, año, kilometraje, condición y transmisión.
    Ver app/services/price_service.py para el detalle del entrenamiento
    y app/services/price_dataset.py para el origen (sintético) de los datos.
    """
    try:
        result = price_service.predict(
            real_car_model=payload.real_car_model,
            brand=payload.brand,
            year=payload.year,
            mileage=payload.mileage,
            condition=payload.condition,
            transmission=payload.transmission,
        )
        return PricePredictionResponse(
            estimatedPrice=result["estimated_price"],
            priceRangeLow=result["price_range_low"],
            priceRangeHigh=result["price_range_high"],
            currency=result["currency"],
            modelMae=result["model_mae"],
        )
    except Exception as exc:  # noqa: BLE001
        logger.exception("Error al estimar el precio")
        raise HTTPException(status_code=500, detail="No se pudo estimar el precio.") from exc


@router.post("/forecast-next-release", response_model=NextReleaseForecastResponse, response_model_by_alias=True)
def forecast_next_release(payload: NextReleaseForecastRequest) -> NextReleaseForecastResponse:
    """
    Tercer algoritmo de ML del sistema: regresión de TENDENCIA.

    A diferencia de /predict-price (que estima el valor de un auto con
    características ya conocidas), este endpoint toma la serie histórica
    año -> precio promedio de un modelo y proyecta linealmente el precio
    del siguiente año no observado (el "próximo lanzamiento" del auto real).
    """
    try:
        result = forecast_service.predict_next_release(
            real_car_model=payload.real_car_model,
            target_year=payload.target_year,
        )
        return NextReleaseForecastResponse(
            targetYear=result["target_year"],
            predictedPrice=result["predicted_price"],
            trendSlopePerYear=result["trend_slope_per_year"],
            rSquared=result["r_squared"],
            basedOnYearFrom=result["based_on_year_from"],
            basedOnYearTo=result["based_on_year_to"],
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:  # noqa: BLE001
        logger.exception("Error al proyectar el precio del próximo lanzamiento")
        raise HTTPException(status_code=500, detail="No se pudo generar la proyección.") from exc


@router.get("/price-stats", response_model=PriceStatsResponse, response_model_by_alias=True)
def get_price_stats(real_car_model: str = Query(..., alias="realCarModel")) -> PriceStatsResponse:
    """
    Estadísticas descriptivas del dataset usado por el modelo de valor
    actual (price_service.py) + importancia de cada característica en
    la predicción del RandomForestRegressor.
    """
    try:
        dataset_stats = stats_service.price_stats(real_car_model)
        feature_importance = stats_service.price_feature_importance()

        return PriceStatsResponse(
            datasetStats=PriceDatasetStats(
                sampleCount=dataset_stats["sample_count"],
                meanPrice=dataset_stats["mean_price"],
                medianPrice=dataset_stats["median_price"],
                minPrice=dataset_stats["min_price"],
                maxPrice=dataset_stats["max_price"],
                stdPrice=dataset_stats["std_price"],
                distribution=[
                    PriceDistributionBucket(
                        rangeLow=b["range_low"], rangeHigh=b["range_high"], count=b["count"]
                    )
                    for b in dataset_stats["distribution"]
                ],
            ),
            featureImportance=[
                FeatureImportanceItem(feature=f["feature"], importance=f["importance"])
                for f in feature_importance
            ],
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:  # noqa: BLE001
        logger.exception("Error al calcular estadísticas de precio")
        raise HTTPException(status_code=500, detail="No se pudieron calcular las estadísticas.") from exc


@router.get("/forecast-stats", response_model=ForecastStatsResponse, response_model_by_alias=True)
def get_forecast_stats(real_car_model: str = Query(..., alias="realCarModel")) -> ForecastStatsResponse:
    """
    Estadísticas descriptivas del dataset usado por el modelo de
    proyección de tendencia (forecast_service.py): tamaño de muestra,
    precio promedio/mediana/min/max y la serie histórica año->precio.
    """
    try:
        stats = stats_service.forecast_stats(real_car_model)

        return ForecastStatsResponse(
            sampleCount=stats["sample_count"],
            yearCount=stats["year_count"],
            meanPrice=stats["mean_price"],
            medianPrice=stats["median_price"],
            minPrice=stats["min_price"],
            maxPrice=stats["max_price"],
            stdPrice=stats["std_price"],
            yearlyAverages=[
                YearlyAveragePoint(year=p["year"], avgPrice=p["avg_price"])
                for p in stats["yearly_averages"]
            ],
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:  # noqa: BLE001
        logger.exception("Error al calcular estadísticas de proyección")
        raise HTTPException(status_code=500, detail="No se pudieron calcular las estadísticas.") from exc