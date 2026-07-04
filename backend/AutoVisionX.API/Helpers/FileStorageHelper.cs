namespace AutoVisionX.API.Helpers;

public static class FileStorageHelper
{
    private static readonly string[] AllowedExtensions = { ".jpg", ".jpeg", ".png", ".webp" };
    private const long MaxFileSizeBytes = 10 * 1024 * 1024; // 10MB

    public static void ValidateImage(IFormFile file)
    {
        if (file is null || file.Length == 0)
            throw new ArgumentException("No se recibió ninguna imagen.");

        if (file.Length > MaxFileSizeBytes)
            throw new ArgumentException("La imagen supera el tamaño máximo permitido (10MB).");

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!AllowedExtensions.Contains(extension))
            throw new ArgumentException("Formato no permitido. Usa JPG, PNG o WEBP.");
    }

    public static async Task<string> SaveUploadedImageAsync(IFormFile file, string uploadsRootPath)
    {
        ValidateImage(file);

        Directory.CreateDirectory(uploadsRootPath);

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        var fileName = $"{Guid.NewGuid()}{extension}";
        var fullPath = Path.Combine(uploadsRootPath, fileName);

        await using var stream = new FileStream(fullPath, FileMode.Create);
        await file.CopyToAsync(stream);

        return fullPath;
    }
}
