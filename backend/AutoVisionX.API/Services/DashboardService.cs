using AutoVisionX.API.Interfaces;

namespace AutoVisionX.API.Services;

public class DashboardService : IDashboardService
{
    private readonly ICarRepository _carRepository;
    private readonly IDetectionHistoryRepository _historyRepository;

    public DashboardService(ICarRepository carRepository, IDetectionHistoryRepository historyRepository)
    {
        _carRepository = carRepository;
        _historyRepository = historyRepository;
    }

    public async Task<object> GetStatsAsync()
    {
        var totalCars = (await _carRepository.GetAllAsync()).Count;
        var totalDetections = await _historyRepository.CountAsync();
        var recent = await _historyRepository.GetRecentAsync(10);

        return new
        {
            totalCars,
            totalDetections,
            recentDetections = recent.Select(r => new
            {
                r.Id,
                r.PredictedLabel,
                r.SimilarityScore,
                r.DetectedAt,
                CarName = r.Car?.Name,
            }),
        };
    }
}
