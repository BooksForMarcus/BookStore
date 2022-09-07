namespace ASP_Vite.Controllers;

using BookStore.DbAccess;
using BookStore.Models;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class WeatherForecastController : ControllerBase
{
    CustomerCrud customers;
    
    private static readonly string[] Summaries = new[]
    {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

    private readonly ILogger<WeatherForecastController> _logger;

    public WeatherForecastController(ILogger<WeatherForecastController> logger,CustomerCrud cc)
    {
        _logger = logger;
        customers = cc;
    }

    [HttpGet]
    public async Task<List<Customer>> Get()
    {
        return await customers.GetAllCustomers();
    }
    [HttpPost]
    public async Task<IActionResult> Post(Customer customer)
    {
        var result = await customers.CreateCustomer(customer);
        if (result) return Ok();
        else return BadRequest();
    }
}
