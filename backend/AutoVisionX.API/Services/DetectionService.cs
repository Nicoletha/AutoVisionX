using System.Text.Json;
using AutoVisionX.API.DTOs;
using AutoVisionX.API.Helpers;
using AutoVisionX.API.Interfaces;
using AutoVisionX.API.Mappings;
using AutoVisionX.API.Models;
using Microsoft.AspNetCore.Http;

namespace AutoVisionX.API.Services;

public class DetectionService : IDetectionService
{
    private readonly ICarRepository _carRepository;
    private readonly IDetectionHistoryRepository _historyRepository;
    private readonly IAiServiceClient _aiServiceClient;
    private readonly IWebHostEnvironment _environment;
    private readonly ILogger<DetectionService> _logger;

    public DetectionService(
        ICarRepository carRepository,
        IDetectionHistoryRepository historyRepository,
        IAiServiceClient aiServiceClient,
        IWebHostEnvironment environment,
        ILogger<DetectionService> logger)
    {
        _carRepository = carRepository;
        _historyRepository = historyRepository;
        _aiServiceClient = aiServiceClient;
        _environment = environment;
        _logger = logger;
    }

        public async Task<PricePredictionResultDto> PredictPriceAsync(PricePredictionRequestDto request)
    {
        return await _aiServiceClient.PredictPriceAsync(request);
    }

    public async Task<NextReleaseForecastResultDto> ForecastNextReleaseAsync(NextReleaseForecastRequestDto request)
    {
        return await _aiServiceClient.ForecastNextReleaseAsync(request);
    }

    public async Task<DetectionResultDto> PredictAsync(IFormFile image, string source)
    {
        // 1. Validar y guardar la imagen recibida.
        var uploadsPath = Path.Combine(_environment.ContentRootPath, "wwwroot", "uploads");
        var savedPath = await FileStorageHelper.SaveUploadedImageAsync(image, uploadsPath);

        _logger.LogInformation("Imagen recibida (source={Source}) guardada en {Path}", source, savedPath);

        // 2. Enviar la imagen al servicio de IA en Python.
        var aiResult = await _aiServiceClient.PredictAsync(savedPath);

        // 3. Buscar el Hot Wheels correspondiente en SQLite, si hubo coincidencia.
        Car? matchedCar = null;
        var recognized = aiResult.Recognized && aiResult.SimilarityScore >= DetectionConstants.SimilarityThreshold;

        if (recognized)
        {
            matchedCar = await _carRepository.GetByClassLabelAsync(aiResult.PredictedLabel);
        }

        // 4. Guardar el historial de la detección.
        var history = new DetectionHistory
        {
            CarId = matchedCar?.Id,
            PredictedLabel = aiResult.PredictedLabel,
            SimilarityScore = aiResult.SimilarityScore,
            UploadedImagePath = $"/uploads/{Path.GetFileName(savedPath)}",
            DetectedPrimaryColorHex = aiResult.DetectedPrimaryColorHex,
            DetectedPrimaryColorName = aiResult.DetectedPrimaryColorName,
            SecondaryColorsJson = JsonSerializer.Serialize(aiResult.SecondaryColors),
        };
        await _historyRepository.CreateAsync(history);

        // 5. Armar y devolver la respuesta final al frontend.
        return new DetectionResultDto
        {
            DetectionId = history.Id,
            PredictedLabel = aiResult.PredictedLabel,
            MatchedCarId = matchedCar?.Id,
            SimilarityScore = aiResult.SimilarityScore,
            DetectedPrimaryColorHex = aiResult.DetectedPrimaryColorHex,
            DetectedPrimaryColorName = aiResult.DetectedPrimaryColorName,
            SecondaryColors = aiResult.SecondaryColors,
            Car = matchedCar?.ToDto(),
            Recognized = recognized,
        };
    }

    public async Task<List<DetectionHistoryDto>> GetHistoryAsync()
    {
        var history = await _historyRepository.GetRecentAsync();
        return history.Select(h => new DetectionHistoryDto
        {
            Id = h.Id,
            CarId = h.CarId,
            CarName = h.Car?.Name,
            PredictedLabel = h.PredictedLabel,
            SimilarityScore = h.SimilarityScore,
            DetectedPrimaryColorHex = h.DetectedPrimaryColorHex,
            DetectedAt = h.DetectedAt,
        }).ToList();
    }

        public async Task<PriceStatsResultDto> GetPriceStatsAsync(string realCarModel)
    {
        return await _aiServiceClient.GetPriceStatsAsync(realCarModel);
    }

    public async Task<ForecastStatsResultDto> GetForecastStatsAsync(string realCarModel)
    {
        return await _aiServiceClient.GetForecastStatsAsync(realCarModel);
    }
}
