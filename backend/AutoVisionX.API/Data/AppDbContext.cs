using AutoVisionX.API.Models;
using Microsoft.EntityFrameworkCore;

namespace AutoVisionX.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Car> Cars => Set<Car>();
    public DbSet<CarImage> CarImages => Set<CarImage>();
    public DbSet<DetectionHistory> DetectionHistories => Set<DetectionHistory>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Car>(entity =>
        {
            entity.HasIndex(c => c.ClassLabel).IsUnique();
            entity.HasMany(c => c.Images)
                  .WithOne(i => i.Car)
                  .HasForeignKey(i => i.CarId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<DetectionHistory>(entity =>
        {
            entity.HasOne(d => d.Car)
                  .WithMany()
                  .HasForeignKey(d => d.CarId)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        // Seed: los 5 modelos del MVP.
        modelBuilder.Entity<Car>().HasData(
            new Car
            {
                Id = 1,
                Name = "Nissan Skyline GT-R R34",
                Brand = "Nissan",
                RealCarModel = "Nissan Skyline GT-R (R34)",
                Year = 2002,
                Series = "HW Performance",
                ColorName = "Red",
                OfficialColorHex = "#D90429",
                Rarity = "Rare",
                Description = "Ícono japonés de alto rendimiento con diseño agresivo y gran detalle.",
                MainImageUrl = "/images/cars/skyline-r34-main.png",
                ClassLabel = "skyline_r34",
                CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Car
            {
                Id = 2,
                Name = "Toyota Supra",
                Brand = "Toyota",
                RealCarModel = "Toyota Supra (A80)",
                Year = 2000,
                Series = "HW Turbo",
                ColorName = "Orange",
                OfficialColorHex = "#F77F00",
                Rarity = "Uncommon",
                Description = "Deportivo japonés reconocido por su motor 2JZ y silueta icónica.",
                MainImageUrl = "/images/cars/supra-main.png",
                ClassLabel = "toyota_supra",
                CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Car
            {
                Id = 3,
                Name = "Ford Mustang",
                Brand = "Ford",
                RealCarModel = "Ford Mustang GT",
                Year = 1998,
                Series = "HW Muscle",
                ColorName = "Blue",
                OfficialColorHex = "#1D3557",
                Rarity = "Common",
                Description = "Muscle car americano clásico, símbolo de potencia y diseño atemporal.",
                MainImageUrl = "/images/cars/mustang-main.png",
                ClassLabel = "ford_mustang",
                CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Car
            {
                Id = 4,
                Name = "Lamborghini Huracán",
                Brand = "Lamborghini",
                RealCarModel = "Lamborghini Huracán",
                Year = 2015,
                Series = "HW Exotics",
                ColorName = "Green",
                OfficialColorHex = "#2B9348",
                Rarity = "Super Treasure Hunt",
                Description = "Superdeportivo italiano de líneas afiladas y presencia dominante.",
                MainImageUrl = "/images/cars/huracan-main.png",
                ClassLabel = "lamborghini_huracan",
                CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new Car
            {
                Id = 5,
                Name = "Porsche 911",
                Brand = "Porsche",
                RealCarModel = "Porsche 911 Carrera",
                Year = 2019,
                Series = "HW Speed Graphics",
                ColorName = "Yellow",
                OfficialColorHex = "#FFB703",
                Rarity = "Rare",
                Description = "Referencia alemana en ingeniería deportiva y diseño atemporal.",
                MainImageUrl = "/images/cars/porsche-911-main.png",
                ClassLabel = "porsche_911",
                CreatedAt = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            }
        );
    }
}
