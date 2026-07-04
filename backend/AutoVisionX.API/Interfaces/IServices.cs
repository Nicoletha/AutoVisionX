using AutoVisionX.API.DTOs;
using Microsoft.AspNetCore.Http;

namespace AutoVisionX.API.Interfaces;

public interface ICarService
{
    Task<List<CarDto>> GetAllAsync();
    Task<CarDto?> GetByIdAsync(int id);
    Task<CarDto> CreateAsync(CreateCarDto dto);
    Task<bool> UpdateAsync(int id, UpdateCarDto dto);
    Task<bool> DeleteAsync(int id);
}

/// <summary>
/// Orquesta el flujo completo de detección: valida la imagen, la guarda,
/// consulta al servicio de IA, cruza el resultado contra el catálogo
/// en SQLite y persiste el historial.
/// </summary>
public interface IDetectionService
{
    Task<DetectionResultDto> PredictAsync(IFormFile image, string source);
    Task<List<DetectionHistoryDto>> GetHistoryAsync();
    Task<PricePredictionResultDto> PredictPriceAsync(PricePredictionRequestDto request);
    Task<NextReleaseForecastResultDto> ForecastNextReleaseAsync(NextReleaseForecastRequestDto request);
    Task<PriceStatsResultDto> GetPriceStatsAsync(string realCarModel);
Task<ForecastStatsResultDto> GetForecastStatsAsync(string realCarModel);
}

/// <summary>
/// Cliente HTTP hacia el microservicio de IA en Python (FastAPI).
/// El frontend nunca habla directamente con este servicio.
/// </summary>
public interface IAiServiceClient
{
    Task<AiPredictionResponseDto> PredictAsync(string imagePath);
    Task<PricePredictionResultDto> PredictPriceAsync(PricePredictionRequestDto request);
    Task<NextReleaseForecastResultDto> ForecastNextReleaseAsync(NextReleaseForecastRequestDto request);
    Task<PriceStatsResultDto> GetPriceStatsAsync(string realCarModel);
Task<ForecastStatsResultDto> GetForecastStatsAsync(string realCarModel);
}

public interface IDashboardService
{
    Task<object> GetStatsAsync();
}
