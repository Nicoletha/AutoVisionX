using AutoVisionX.API.DTOs;
using AutoVisionX.API.Interfaces;
using AutoVisionX.API.Mappings;

namespace AutoVisionX.API.Services;

public class CarService : ICarService
{
    private readonly ICarRepository _carRepository;

    public CarService(ICarRepository carRepository)
    {
        _carRepository = carRepository;
    }

    public async Task<List<CarDto>> GetAllAsync()
    {
        var cars = await _carRepository.GetAllAsync();
        return cars.Select(c => c.ToDto()).ToList();
    }

    public async Task<CarDto?> GetByIdAsync(int id)
    {
        var car = await _carRepository.GetByIdAsync(id);
        return car?.ToDto();
    }

    public async Task<CarDto> CreateAsync(CreateCarDto dto)
    {
        var entity = dto.ToEntity();
        var created = await _carRepository.CreateAsync(entity);
        return created.ToDto();
    }

    public async Task<bool> UpdateAsync(int id, UpdateCarDto dto)
    {
        var car = await _carRepository.GetByIdAsync(id);
        if (car is null) return false;
        car.ApplyUpdate(dto);
        return await _carRepository.UpdateAsync(car);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        return await _carRepository.DeleteAsync(id);
    }
}
