from pydantic import BaseModel, Field


class PredictionResponse(BaseModel):
    """Respuesta que el servicio de IA devuelve al backend ASP.NET Core."""

    predicted_label: str = Field(alias="predictedLabel")
    similarity_score: float = Field(alias="similarityScore")
    detected_primary_color_hex: str = Field(alias="detectedPrimaryColorHex")
    detected_primary_color_name: str = Field(alias="detectedPrimaryColorName")
    secondary_colors: list[str] = Field(alias="secondaryColors")
    recognized: bool

    class Config:
        populate_by_name = True
        # Serializa usando los nombres en camelCase esperados por el backend .NET
        json_schema_extra = {
            "example": {
                "predictedLabel": "skyline_r34",
                "similarityScore": 0.946,
                "detectedPrimaryColorHex": "#E10600",
                "detectedPrimaryColorName": "Rojo",
                "secondaryColors": ["#2C2C2C", "#C9C9C9", "#F4F4F4"],
                "recognized": True,
            }
        }


class HealthResponse(BaseModel):
    status: str
    catalog_classes: int

class PricePredictionRequest(BaseModel):
    """Payload enviado por el backend para estimar el precio del auto real."""

    real_car_model: str = Field(alias="realCarModel")
    brand: str
    year: int
    mileage: int = Field(ge=0)
    condition: str = Field(description="Excelente | Buena | Regular | Mala")
    transmission: str = Field(description="Manual | Automática")
    number_of_owners: int = Field(default=1, ge=1, le=5, alias="numberOfOwners")
    accident_history: str = Field(default="No", description="Sí | No", alias="accidentHistory")
    modifications: str = Field(default="De fábrica", description="De fábrica | Modificado")

    class Config:
        populate_by_name = True


class PricePredictionResponse(BaseModel):
    """Respuesta del modelo de regresión (independiente del de clasificación)."""

    estimated_price: float = Field(alias="estimatedPrice")
    price_range_low: float = Field(alias="priceRangeLow")
    price_range_high: float = Field(alias="priceRangeHigh")
    currency: str
    model_mae: float = Field(alias="modelMae")

    class Config:
        populate_by_name = True


class NextReleaseForecastRequest(BaseModel):
    """Payload para el modelo de TENDENCIA (tercer algoritmo, distinto al de precio puntual)."""

    real_car_model: str = Field(alias="realCarModel")
    target_year: int | None = Field(default=None, alias="targetYear")

    class Config:
        populate_by_name = True


class NextReleaseForecastResponse(BaseModel):
    target_year: int = Field(alias="targetYear")
    predicted_price: float = Field(alias="predictedPrice")
    trend_slope_per_year: float = Field(alias="trendSlopePerYear")
    r_squared: float = Field(alias="rSquared")
    based_on_year_from: int = Field(alias="basedOnYearFrom")
    based_on_year_to: int = Field(alias="basedOnYearTo")

    class Config:
        populate_by_name = True

class PriceDistributionBucket(BaseModel):
    range_low: float = Field(alias="rangeLow")
    range_high: float = Field(alias="rangeHigh")
    count: int

    class Config:
        populate_by_name = True


class PriceDatasetStats(BaseModel):
    sample_count: int = Field(alias="sampleCount")
    mean_price: float = Field(alias="meanPrice")
    median_price: float = Field(alias="medianPrice")
    min_price: float = Field(alias="minPrice")
    max_price: float = Field(alias="maxPrice")
    std_price: float = Field(alias="stdPrice")
    distribution: list[PriceDistributionBucket]

    class Config:
        populate_by_name = True


class FeatureImportanceItem(BaseModel):
    feature: str
    importance: float

    class Config:
        populate_by_name = True


class PriceStatsResponse(BaseModel):
    """Estadísticas del dataset + importancia de características (modelo de valor actual)."""

    dataset_stats: PriceDatasetStats = Field(alias="datasetStats")
    feature_importance: list[FeatureImportanceItem] = Field(alias="featureImportance")

    class Config:
        populate_by_name = True


class YearlyAveragePoint(BaseModel):
    year: int
    avg_price: float = Field(alias="avgPrice")

    class Config:
        populate_by_name = True


class ForecastStatsResponse(BaseModel):
    """Estadísticas del dataset + serie histórica (modelo de proyección de tendencia)."""

    sample_count: int = Field(alias="sampleCount")
    year_count: int = Field(alias="yearCount")
    mean_price: float = Field(alias="meanPrice")
    median_price: float = Field(alias="medianPrice")
    min_price: float = Field(alias="minPrice")
    max_price: float = Field(alias="maxPrice")
    std_price: float = Field(alias="stdPrice")
    yearly_averages: list[YearlyAveragePoint] = Field(alias="yearlyAverages")

    class Config:
        populate_by_name = True