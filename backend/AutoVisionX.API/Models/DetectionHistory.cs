namespace AutoVisionX.API.Models;

/// <summary>
/// Registro histórico de cada detección realizada por el sistema.
/// No está ligado a ningún usuario: el proyecto no maneja cuentas.
/// </summary>
public class DetectionHistory
{
    public int Id { get; set; }

    /// <summary>Null si el sistema no encontró coincidencia por debajo del umbral.</summary>
    public int? CarId { get; set; }
    public Car? Car { get; set; }

    /// <summary>Etiqueta cruda devuelta por el servicio de IA. Ej: "skyline_r34".</summary>
    public string PredictedLabel { get; set; } = string.Empty;

    public double SimilarityScore { get; set; }

    public string UploadedImagePath { get; set; } = string.Empty;

    public string DetectedPrimaryColorHex { get; set; } = string.Empty;

    public string DetectedPrimaryColorName { get; set; } = string.Empty;

    /// <summary>Colores secundarios serializados como JSON: ["#2C2C2C", "#C9C9C9"].</summary>
    public string SecondaryColorsJson { get; set; } = "[]";

    public DateTime DetectedAt { get; set; } = DateTime.UtcNow;

    public string? Notes { get; set; }
}
