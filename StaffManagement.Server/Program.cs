using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using StaffManagement.Server.Connection;
using StaffManagement.Server.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Add DbContext with SQLite
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));
// Add StaffService to Dependency Injection
builder.Services.AddScoped<StaffService>();



builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
//else
{
    app.UseHttpsRedirection();  // Only use HTTPS redirection in production
}

app.UseAuthorization();
app.MapControllers();
app.MapFallbackToFile("/index.html");
app.Run();
