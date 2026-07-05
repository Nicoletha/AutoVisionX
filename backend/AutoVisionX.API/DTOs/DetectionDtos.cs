using Microsoft.AspNetCore.Http;

namespace AutoVisionX.API.DTOs;

/// <summary>Payload multipart/form-data enviado por el frontend.</summary>
public class DetectionRequestDto
{
    public IFormFile Image { get; set; } = null!;

    /// <summary>"upload" o "camera".</summary>
    public string Source { get; set; } = "upload";
}

/// <summary>Respuesta cruda que entrega el servicio de IA en Python.</summary>
public class AiPredictionResponseDto
{
    public string PredictedLabel { get; set; } = string.Empty;
    public double SimilarityScore { get; set; }
    public string DetectedPrimaryColorHex { get; set; } = string.Empty;
    public string DetectedPrimaryColorName { get; set; } = string.Empty;
    public List<string> SecondaryColors { get; set; } = new();
    public bool Recognized { get; set; }
}

/// <summary>Respuesta final que el backend entrega al frontend.</summary>
public class DetectionResultDto
{
    public int DetectionId { get; set; }
    public string PredictedLabel { get; set; } = string.Empty;
    public int? MatchedCarId { get; set; }
    public double SimilarityScore { get; set; }
    public string DetectedPrimaryColorHex { get; set; } = string.Empty;
    public string DetectedPrimaryColorName { get; set; } = string.Empty;
    public List<string> SecondaryColors { get; set; } = new();
    public CarDto? Car { get; set; }
    public bool Recognized { get; set; }
}

public class DetectionHistoryDto
{
    public int Id { get; set; }
    public int? CarId { get; set; }
    public string? CarName { get; set; }
    public string PredictedLabel { get; set; } = string.Empty;
    public double SimilarityScore { get; set; }
    public string DetectedPrimaryColorHex { get; set; } = string.Empty;
    public DateTime DetectedAt { get; set; }
}

public class PricePredictionRequestDto
{
    public string RealCarModel { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public int Year { get; set; }
    public int Mileage { get; set; }

    /// <summary>Excelente | Buena | Regular | Mala</summary>
    public string Condition { get; set; } = "Buena";

    /// <summary>Manual | Automática</summary>
    public string Transmission { get; set; } = "Automática";

    public int NumberOfOwners { get; set; } = 1;

    /// <summary>Sí | No</summary>
    public string AccidentHistory { get; set; } = "No";

    /// <summary>De fábrica | Modificado</summary>
    public string Modifications { get; set; } = "De fábrica";
}
public class PricePredictionResultDto
{
    public double EstimatedPrice { get; set; }
    public double PriceRangeLow { get; set; }
    public double PriceRangeHigh { get; set; }
    public string Currency { get; set; } = "USD";
    public double ModelMae { get; set; }
}

public class NextReleaseForecastRequestDto
{
    public string RealCarModel { get; set; } = string.Empty;
    public int? TargetYear { get; set; }
}

public class NextReleaseForecastResultDto
{
    public int TargetYear { get; set; }
    public double PredictedPrice { get; set; }
    public double TrendSlopePerYear { get; set; }
    public double RSquared { get; set; }
    public int BasedOnYearFrom { get; set; }
    public int BasedOnYearTo { get; set; }
}

public class PriceDistributionBucketDto
{
    public double RangeLow { get; set; }
    public double RangeHigh { get; set; }
    public int Count { get; set; }
}

public class PriceDatasetStatsDto
{
    public int SampleCount { get; set; }
    public double MeanPrice { get; set; }
    public double MedianPrice { get; set; }
    public double MinPrice { get; set; }
    public double MaxPrice { get; set; }
    public double StdPrice { get; set; }
    public List<PriceDistributionBucketDto> Distribution { get; set; } = new();
}

public class FeatureImportanceItemDto
{
    public string Feature { get; set; } = string.Empty;
    public double Importance { get; set; }
}

public class PriceStatsResultDto
{
    public PriceDatasetStatsDto DatasetStats { get; set; } = new();
    public List<FeatureImportanceItemDto> FeatureImportance { get; set; } = new();
}

public class YearlyAveragePointDto
{
    public int Year { get; set; }
    public double AvgPrice { get; set; }
}

public class ForecastStatsResultDto
{
    public int SampleCount { get; set; }
    public int YearCount { get; set; }
    public double MeanPrice { get; set; }
    public double MedianPrice { get; set; }
    public double MinPrice { get; set; }
    public double MaxPrice { get; set; }
    public double StdPrice { get; set; }
    public List<YearlyAveragePointDto> YearlyAverages { get; set; } = new();
}