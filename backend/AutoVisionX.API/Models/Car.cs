namespace AutoVisionX.API.Models;

/// <summary>
/// Representa un modelo de Hot Wheels dentro del catálogo del sistema.
/// </summary>
public class Car
{
    public int Id { get; set; }

    /// <summary>Nombre comercial del Hot Wheels. Ej: "Nissan Skyline GT-R R34".</summary>
    public string Name { get; set; } = string.Empty;

    public string Brand { get; set; } = string.Empty;

    /// <summary>Auto real en el que está basado el modelo a escala.</summary>
    public string RealCarModel { get; set; } = string.Empty;

    public int Year { get; set; }

    public string Series { get; set; } = string.Empty;

    public string ColorName { get; set; } = string.Empty;

    /// <summary>Color oficial de fábrica en formato HEX. Ej: "#D90429".</summary>
    public string OfficialColorHex { get; set; } = string.Empty;

    /// <summary>Rareza del modelo: Common, Uncommon, Rare, Super Treasure Hunt, etc.</summary>
    public string Rarity { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string MainImageUrl { get; set; } = string.Empty;

    /// <summary>
    /// Etiqueta usada por el servicio de IA para identificar la clase durante
    /// el matching de embeddings. Ej: "skyline_r34".
    /// </summary>
    public string ClassLabel { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<CarImage> Images { get; set; } = new List<CarImage>();
}
