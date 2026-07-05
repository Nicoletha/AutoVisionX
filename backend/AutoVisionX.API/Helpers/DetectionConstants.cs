namespace AutoVisionX.API.Helpers;

public static class DetectionConstants
{
    /// <summary>
    /// Umbral mínimo de similitud (0.0 - 1.0) para considerar que el
    /// servicio de IA encontró una coincidencia válida en el catálogo.
    /// </summary>
    public const double SimilarityThreshold = 0.40;
}
