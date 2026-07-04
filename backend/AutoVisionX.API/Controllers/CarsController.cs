using AutoVisionX.API.DTOs;
using AutoVisionX.API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AutoVisionX.API.Controllers;

[ApiController]
[Route("api/cars")]
public class CarsController : ControllerBase
{
    private readonly ICarService _carService;

    public CarsController(ICarService carService)
    {
        _carService = carService;
    }

    /// <summary>GET /api/cars</summary>
    [HttpGet]
    public async Task<ActionResult<List<CarDto>>> GetAll()
    {
        var cars = await _carService.GetAllAsync();
        return Ok(cars);
    }

    /// <summary>GET /api/cars/{id}</summary>
    [HttpGet("{id:int}")]
    public async Task<ActionResult<CarDto>> GetById(int id)
    {
        var car = await _carService.GetByIdAsync(id);
        if (car is null) return NotFound(new { message = $"No existe un Hot Wheels con id {id}." });
        return Ok(car);
    }

    /// <summary>POST /api/cars</summary>
    [HttpPost]
    public async Task<ActionResult<CarDto>> Create([FromBody] CreateCarDto dto)
    {
        var created = await _carService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    /// <summary>PUT /api/cars/{id}</summary>
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateCarDto dto)
    {
        var updated = await _carService.UpdateAsync(id, dto);
        if (!updated) return NotFound(new { message = $"No existe un Hot Wheels con id {id}." });
        return NoContent();
    }

    /// <summary>DELETE /api/cars/{id}</summary>
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _carService.DeleteAsync(id);
        if (!deleted) return NotFound(new { message = $"No existe un Hot Wheels con id {id}." });
        return NoContent();
    }
}
