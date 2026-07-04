using AutoVisionX.API.Models;

namespace AutoVisionX.API.Interfaces;

public interface ICarRepository
{
    Task<List<Car>> GetAllAsync();
    Task<Car?> GetByIdAsync(int id);
    Task<Car?> GetByClassLabelAsync(string classLabel);
    Task<Car> CreateAsync(Car car);
    Task<bool> UpdateAsync(Car car);
    Task<bool> DeleteAsync(int id);
}
