using AutoVisionX.API.Models;

namespace AutoVisionX.API.Interfaces;

public interface IDetectionHistoryRepository
{
    Task<DetectionHistory> CreateAsync(DetectionHistory history);
    Task<List<DetectionHistory>> GetRecentAsync(int take = 50);
    Task<int> CountAsync();
}
