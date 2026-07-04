using AutoVisionX.API.DTOs;
using AutoVisionX.API.Models;

namespace AutoVisionX.API.Mappings;

public static class CarMappings
{
    public static CarDto ToDto(this Car car)
    {
        return new CarDto
        {
            Id = car.Id,
            Name = car.Name,
            Brand = car.Brand,
            RealCarModel = car.RealCarModel,
            Year = car.Year,
            Series = car.Series,
            ColorName = car.ColorName,
            OfficialColorHex = car.OfficialColorHex,
            Rarity = car.Rarity,
            Description = car.Description,
            MainImageUrl = car.MainImageUrl,
            Images = car.Images.Select(i => new CarImageDto
            {
                Id = i.Id,
                ImageUrl = i.ImageUrl,
                AngleType = i.AngleType,
                IsPrimary = i.IsPrimary,
            }).ToList(),
        };
    }

    public static Car ToEntity(this CreateCarDto dto)
    {
        return new Car
        {
            Name = dto.Name,
            Brand = dto.Brand,
            RealCarModel = dto.RealCarModel,
            Year = dto.Year,
            Series = dto.Series,
            ColorName = dto.ColorName,
            OfficialColorHex = dto.OfficialColorHex,
            Rarity = dto.Rarity,
            Description = dto.Description,
            MainImageUrl = dto.MainImageUrl,
            ClassLabel = dto.ClassLabel,
        };
    }

    public static void ApplyUpdate(this Car car, UpdateCarDto dto)
    {
        car.Name = dto.Name;
        car.Brand = dto.Brand;
        car.RealCarModel = dto.RealCarModel;
        car.Year = dto.Year;
        car.Series = dto.Series;
        car.ColorName = dto.ColorName;
        car.OfficialColorHex = dto.OfficialColorHex;
        car.Rarity = dto.Rarity;
        car.Description = dto.Description;
        car.MainImageUrl = dto.MainImageUrl;
        car.ClassLabel = dto.ClassLabel;
    }
}
