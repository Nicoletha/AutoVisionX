using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace AutoVisionX.API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Cars",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Brand = table.Column<string>(type: "TEXT", nullable: false),
                    RealCarModel = table.Column<string>(type: "TEXT", nullable: false),
                    Year = table.Column<int>(type: "INTEGER", nullable: false),
                    Series = table.Column<string>(type: "TEXT", nullable: false),
                    ColorName = table.Column<string>(type: "TEXT", nullable: false),
                    OfficialColorHex = table.Column<string>(type: "TEXT", nullable: false),
                    Rarity = table.Column<string>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: false),
                    MainImageUrl = table.Column<string>(type: "TEXT", nullable: false),
                    ClassLabel = table.Column<string>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cars", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CarImages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    CarId = table.Column<int>(type: "INTEGER", nullable: false),
                    ImageUrl = table.Column<string>(type: "TEXT", nullable: false),
                    AngleType = table.Column<string>(type: "TEXT", nullable: false),
                    IsPrimary = table.Column<bool>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CarImages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CarImages_Cars_CarId",
                        column: x => x.CarId,
                        principalTable: "Cars",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DetectionHistories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    CarId = table.Column<int>(type: "INTEGER", nullable: true),
                    PredictedLabel = table.Column<string>(type: "TEXT", nullable: false),
                    SimilarityScore = table.Column<double>(type: "REAL", nullable: false),
                    UploadedImagePath = table.Column<string>(type: "TEXT", nullable: false),
                    DetectedPrimaryColorHex = table.Column<string>(type: "TEXT", nullable: false),
                    DetectedPrimaryColorName = table.Column<string>(type: "TEXT", nullable: false),
                    SecondaryColorsJson = table.Column<string>(type: "TEXT", nullable: false),
                    DetectedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Notes = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DetectionHistories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DetectionHistories_Cars_CarId",
                        column: x => x.CarId,
                        principalTable: "Cars",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.InsertData(
                table: "Cars",
                columns: new[] { "Id", "Brand", "ClassLabel", "ColorName", "CreatedAt", "Description", "MainImageUrl", "Name", "OfficialColorHex", "Rarity", "RealCarModel", "Series", "Year" },
                values: new object[,]
                {
                    { 1, "Nissan", "skyline_r34", "Red", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Ícono japonés de alto rendimiento con diseño agresivo y gran detalle.", "/images/cars/skyline-r34-main.png", "Nissan Skyline GT-R R34", "#D90429", "Rare", "Nissan Skyline GT-R (R34)", "HW Performance", 2002 },
                    { 2, "Toyota", "toyota_supra", "Orange", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Deportivo japonés reconocido por su motor 2JZ y silueta icónica.", "/images/cars/supra-main.png", "Toyota Supra", "#F77F00", "Uncommon", "Toyota Supra (A80)", "HW Turbo", 2000 },
                    { 3, "Ford", "ford_mustang", "Blue", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Muscle car americano clásico, símbolo de potencia y diseño atemporal.", "/images/cars/mustang-main.png", "Ford Mustang", "#1D3557", "Common", "Ford Mustang GT", "HW Muscle", 1998 },
                    { 4, "Lamborghini", "lamborghini_huracan", "Green", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Superdeportivo italiano de líneas afiladas y presencia dominante.", "/images/cars/huracan-main.png", "Lamborghini Huracán", "#2B9348", "Super Treasure Hunt", "Lamborghini Huracán", "HW Exotics", 2015 },
                    { 5, "Porsche", "porsche_911", "Yellow", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Referencia alemana en ingeniería deportiva y diseño atemporal.", "/images/cars/porsche-911-main.png", "Porsche 911", "#FFB703", "Rare", "Porsche 911 Carrera", "HW Speed Graphics", 2019 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_CarImages_CarId",
                table: "CarImages",
                column: "CarId");

            migrationBuilder.CreateIndex(
                name: "IX_Cars_ClassLabel",
                table: "Cars",
                column: "ClassLabel",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DetectionHistories_CarId",
                table: "DetectionHistories",
                column: "CarId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CarImages");

            migrationBuilder.DropTable(
                name: "DetectionHistories");

            migrationBuilder.DropTable(
                name: "Cars");
        }
    }
}
