using AutoVisionX.API.DTOs;
using AutoVisionX.API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AutoVisionX.API.Controllers;

[ApiController]
[Route("api/detection")]
public class DetectionController : ControllerBase
{
    private readonly IDetectionService _detectionService;

    public DetectionController(IDetectionService detectionService)
    {
        _detectionService = detectionService;
    }

    /// <summary>
    /// POST /api/detection/predict
    /// Recibe la imagen (multipart/form-data) desde el frontend React,
    /// la reenvía al servicio de IA y devuelve la ficha completa del Hot Wheels.
    /// </summary>
    [HttpPost("predict")]
    [RequestSizeLimit(10 * 1024 * 1024)]
    public async Task<ActionResult<DetectionResultDto>> Predict([FromForm] DetectionRequestDto request)
    {
        var result = await _detectionService.PredictAsync(request.Image, request.Source);
        return Ok(result);
    }

    /// <summary>GET /api/detection/history</summary>
    [HttpGet("history")]
    public async Task<ActionResult<List<DetectionHistoryDto>>> GetHistory()
    {
        var history = await _detectionService.GetHistoryAsync();
        return Ok(history);
    }

        [HttpPost("predict-price")]
    public async Task<ActionResult<PricePredictionResultDto>> PredictPrice([FromBody] PricePredictionRequestDto request)
    {
        var result = await _detectionService.PredictPriceAsync(request);
        return Ok(result);
    }

    [HttpPost("forecast-next-release")]
    public async Task<ActionResult<NextReleaseForecastResultDto>> ForecastNextRelease([FromBody] NextReleaseForecastRequestDto request)
    {
        var result = await _detectionService.ForecastNextReleaseAsync(request);
        return Ok(result);
    }

    [HttpGet("price-stats")]
    public async Task<ActionResult<PriceStatsResultDto>> GetPriceStats([FromQuery] string realCarModel)
    {
        var result = await _detectionService.GetPriceStatsAsync(realCarModel);
        return Ok(result);
    }

    [HttpGet("forecast-stats")]
    public async Task<ActionResult<ForecastStatsResultDto>> GetForecastStats([FromQuery] string realCarModel)
    {
        var result = await _detectionService.GetForecastStatsAsync(realCarModel);
        return Ok(result);
    }
}
