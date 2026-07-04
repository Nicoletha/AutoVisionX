namespace AutoVisionX.API.DTOs;

public class CarImageDto
{
    public int Id { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string AngleType { get; set; } = string.Empty;
    public bool IsPrimary { get; set; }
}

public class CarDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public string RealCarModel { get; set; } = string.Empty;
    public int Year { get; set; }
    public string Series { get; set; } = string.Empty;
    public string ColorName { get; set; } = string.Empty;
    public string OfficialColorHex { get; set; } = string.Empty;
    public string Rarity { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string MainImageUrl { get; set; } = string.Empty;
    public List<CarImageDto> Images { get; set; } = new();
}

public class CreateCarDto
{
    public string Name { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public string RealCarModel { get; set; } = string.Empty;
    public int Year { get; set; }
    public string Series { get; set; } = string.Empty;
    public string ColorName { get; set; } = string.Empty;
    public string OfficialColorHex { get; set; } = string.Empty;
    public string Rarity { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string MainImageUrl { get; set; } = string.Empty;
    public string ClassLabel { get; set; } = string.Empty;
}

public class UpdateCarDto : CreateCarDto
{
}
