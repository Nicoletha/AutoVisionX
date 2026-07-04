using AutoVisionX.API.Data;
using AutoVisionX.API.Interfaces;
using AutoVisionX.API.Models;
using Microsoft.EntityFrameworkCore;

namespace AutoVisionX.API.Repositories;

public class CarRepository : ICarRepository
{
    private readonly AppDbContext _context;

    public CarRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Car>> GetAllAsync()
    {
        return await _context.Cars
            .Include(c => c.Images)
            .OrderBy(c => c.Name)
            .ToListAsync();
    }

    public async Task<Car?> GetByIdAsync(int id)
    {
        return await _context.Cars
            .Include(c => c.Images)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<Car?> GetByClassLabelAsync(string classLabel)
    {
        return await _context.Cars
            .Include(c => c.Images)
            .FirstOrDefaultAsync(c => c.ClassLabel == classLabel);
    }

    public async Task<Car> CreateAsync(Car car)
    {
        _context.Cars.Add(car);
        await _context.SaveChangesAsync();
        return car;
    }

    public async Task<bool> UpdateAsync(Car car)
    {
        _context.Cars.Update(car);
        var affected = await _context.SaveChangesAsync();
        return affected > 0;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var car = await _context.Cars.FindAsync(id);
        if (car is null) return false;
        _context.Cars.Remove(car);
        await _context.SaveChangesAsync();
        return true;
    }
}
