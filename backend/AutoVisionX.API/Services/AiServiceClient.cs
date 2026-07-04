using System.Text.Json;
using AutoVisionX.API.DTOs;
using AutoVisionX.API.Interfaces;
using System.Net.Http.Json;

namespace AutoVisionX.API.Services;

/// <summary>
/// Único punto de contacto entre el backend y el microservicio de IA.
/// El frontend nunca llama directamente a Python: solo el backend lo hace.
/// </summary>
public class AiServiceClient : IAiServiceClient
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<AiServiceClient> _logger;
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
    };

    public AiServiceClient(HttpClient httpClient, ILogger<AiServiceClient> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
    }

    public async Task<AiPredictionResponseDto> PredictAsync(string imagePath)
    {
        await using var fileStream = File.OpenRead(imagePath);
        using var content = new MultipartFormDataContent();
        using var streamContent = new StreamContent(fileStream);
        streamContent.Headers.ContentType =
            new System.Net.Http.Headers.MediaTypeHeaderValue(GetContentType(imagePath));

        content.Add(streamContent, "image", Path.GetFileName(imagePath));

        // El servicio de IA (FastAPI) expone POST /predict
        var response = await _httpClient.PostAsync("/predict", content);
        response.EnsureSuccessStatusCode();

        var json = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<AiPredictionResponseDto>(json, JsonOptions);

        return result ?? new AiPredictionResponseDto { Recognized = false };
    }

    private static string GetContentType(string path)
    {
        var ext = Path.GetExtension(path).ToLowerInvariant();
        return ext switch
        {
            ".png" => "image/png",
            ".webp" => "image/webp",
            _ => "image/jpeg",
        };
    }

    public async Task<PricePredictionResultDto> PredictPriceAsync(PricePredictionRequestDto request)
    {
        var payload = new
        {
            realCarModel = request.RealCarModel,
            brand = request.Brand,
            year = request.Year,
            mileage = request.Mileage,
            condition = request.Condition,
            transmission = request.Transmission,
        };

        var response = await _httpClient.PostAsJsonAsync("/predict-price", payload);
        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<PricePredictionResultDto>(JsonOptions);
        return result ?? new PricePredictionResultDto();
    }

    public async Task<NextReleaseForecastResultDto> ForecastNextReleaseAsync(NextReleaseForecastRequestDto request)
    {
        var payload = new
        {
            realCarModel = request.RealCarModel,
            targetYear = request.TargetYear,
        };

        var response = await _httpClient.PostAsJsonAsync("/forecast-next-release", payload);
        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<NextReleaseForecastResultDto>(JsonOptions);
        return result ?? new NextReleaseForecastResultDto();
    }

        public async Task<PriceStatsResultDto> GetPriceStatsAsync(string realCarModel)
    {
        var url = $"/price-stats?realCarModel={Uri.EscapeDataString(realCarModel)}";
        var response = await _httpClient.GetAsync(url);
        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<PriceStatsResultDto>(JsonOptions);
        return result ?? new PriceStatsResultDto();
    }

    public async Task<ForecastStatsResultDto> GetForecastStatsAsync(string realCarModel)
    {
        var url = $"/forecast-stats?realCarModel={Uri.EscapeDataString(realCarModel)}";
        var response = await _httpClient.GetAsync(url);
        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<ForecastStatsResultDto>(JsonOptions);
        return result ?? new ForecastStatsResultDto();
    }
}