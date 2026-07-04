namespace AutoVisionX.API.Models;

/// <summary>
/// Imagen de referencia asociada a un Car. También sirve como fuente
/// para generar los embeddings visuales del catálogo en el servicio de IA.
/// </summary>
public class CarImage
{
    public int Id { get; set; }

    public int CarId { get; set; }
    public Car? Car { get; set; }

    public string ImageUrl { get; set; } = string.Empty;

    /// <summary>Ángulo de la toma: front, back, side, top, package, etc.</summary>
    public string AngleType { get; set; } = string.Empty;

    public bool IsPrimary { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
