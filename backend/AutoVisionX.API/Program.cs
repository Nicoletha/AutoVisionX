using AutoVisionX.API.Data;
using AutoVisionX.API.Interfaces;
using AutoVisionX.API.Middleware;
using AutoVisionX.API.Repositories;
using AutoVisionX.API.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// ---------- Servicios ----------

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "AutoVisionX API",
        Version = "v1",
        Description = "Backend orquestador: recibe imágenes del frontend, consulta al servicio de IA y devuelve la ficha del Hot Wheels detectado."
    });
});

// EF Core + SQLite
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")
        ?? "Data Source=autovisionx.db"));

// Repositorios
builder.Services.AddScoped<ICarRepository, CarRepository>();
builder.Services.AddScoped<IDetectionHistoryRepository, DetectionHistoryRepository>();

// Servicios de negocio
builder.Services.AddScoped<ICarService, CarService>();
builder.Services.AddScoped<IDetectionService, DetectionService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();

// Cliente HTTP hacia el microservicio de IA (Python / FastAPI)
var aiServiceBaseUrl = builder.Configuration["AiService:BaseUrl"] ?? "http://localhost:8000";
builder.Services.AddHttpClient<IAiServiceClient, AiServiceClient>(client =>
{
    client.BaseAddress = new Uri(aiServiceBaseUrl);
    client.Timeout = TimeSpan.FromSeconds(30);
});

// CORS: permite que el frontend React (Vite) consuma la API en desarrollo.
const string CorsPolicy = "AutoVisionXFrontend";
builder.Services.AddCors(options =>
{
    options.AddPolicy(CorsPolicy, policy =>
    {
        policy
            .WithOrigins(
                builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
                ?? new[] { "http://localhost:5173" })
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

// ---------- Migraciones automáticas en desarrollo ----------
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

// ---------- Middleware pipeline ----------

app.UseExceptionHandling();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseStaticFiles(); // sirve wwwroot/uploads y wwwroot/images
app.UseCors(CorsPolicy);
app.UseAuthorization();
app.MapControllers();

app.Run();
