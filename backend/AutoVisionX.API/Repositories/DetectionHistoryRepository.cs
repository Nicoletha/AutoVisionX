using AutoVisionX.API.Data;
using AutoVisionX.API.Interfaces;
using AutoVisionX.API.Models;
using Microsoft.EntityFrameworkCore;

namespace AutoVisionX.API.Repositories;

public class DetectionHistoryRepository : IDetectionHistoryRepository
{
    private readonly AppDbContext _context;

    public DetectionHistoryRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<DetectionHistory> CreateAsync(DetectionHistory history)
    {
        _context.DetectionHistories.Add(history);
        await _context.SaveChangesAsync();
        return history;
    }

    public async Task<List<DetectionHistory>> GetRecentAsync(int take = 50)
    {
        return await _context.DetectionHistories
            .Include(d => d.Car)
            .OrderByDescending(d => d.DetectedAt)
            .Take(take)
            .ToListAsync();
    }

    public async Task<int> CountAsync()
    {
        return await _context.DetectionHistories.CountAsync();
    }
}
