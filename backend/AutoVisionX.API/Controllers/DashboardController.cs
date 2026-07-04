using AutoVisionX.API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AutoVisionX.API.Controllers;

/// <summary>
/// Métricas internas del sistema. No se expone en la navegación principal
/// de la UI, pero está disponible para fines de monitoreo/demostración.
/// </summary>
[ApiController]
[Route("api/dashboard")]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;

    public DashboardController(IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    /// <summary>GET /api/dashboard/stats</summary>
    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var stats = await _dashboardService.GetStatsAsync();
        return Ok(stats);
    }
}
