namespace BookStore.Controllers;

using BookStore.DbAccess;
using BookStore.Models;
using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
public class CustomerController : ControllerBase
{
    private readonly CustomerCrud _customerCrud;

    public CustomerController(CustomerCrud customerCrud) =>
        _customerCrud = customerCrud;


    // GET: api/<CustomerController>
    [HttpGet]
    public async Task<IEnumerable<Customer>> Get()
    {
        return await _customerCrud.GetAllCustomers();
    }


    // POST api/<CustomerController>
    [HttpPost]
    public async Task<IActionResult> Post(Customer customer)
    {
        var result = await _customerCrud.CreateCustomer(customer);
        if (result) return Ok();
        else return BadRequest();
    }

    [HttpPut]
    public async Task<IActionResult> Put(Customer customer)
    {
        var result = await _customerCrud.UpdateCustomer(customer);
        if (!String.IsNullOrWhiteSpace(result.Id)) return Ok();
        return BadRequest();
    }


    //Takes string Id
    [HttpDelete]
    public async Task<IActionResult> Delete(string id)
    {
        var result = await _customerCrud.DeleteCustomer(id);
        if (result) return Ok();
        else return BadRequest();
    }
}
