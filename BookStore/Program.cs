using BookStore.Authorize;
using BookStore.DbAccess;
using System.Web.Http.Hosting;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllersWithViews();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSingleton<MongoDbAccess>();
builder.Services.AddSingleton<CustomerCrud>();
builder.Services.AddSingleton<OrderCRUD>();
builder.Services.AddSingleton<BookCrud>();
builder.Services.AddSingleton<CategoryCrud>();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1",
        new Microsoft.OpenApi.Models.OpenApiInfo
        {
            Title = "BookStoreForMarcus API - Ver 1",
            Version = "v1"
        }
     );

    var filePath = Path.Combine(System.AppContext.BaseDirectory, "BookStore.xml");
    c.IncludeXmlComments(filePath);
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    await new DbSeeder().Seed();
}

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");
app.UseMiddleware<BasicAuthMiddleware>();

app.Run();
