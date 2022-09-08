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

    //// GET api/<CustomerController>/5
    //[HttpGet("{id}")]
    //public string Get(int id)
    //{
    //    return "value";
    //}

    // POST api/<CustomerController>
    [HttpPost]
    public async Task<IActionResult> Post(Customer customer)
    {
        var result = await _customerCrud.CreateCustomer(customer);
        if (result) return Ok();
        else return BadRequest();
    }

    //// PUT api/<CustomerController>/5
    //[HttpPut("{id}")]
    //public void Put(int id, [FromBody] string value)
    //{
    //}

    //// DELETE api/<CustomerController>/5
    //[HttpDelete("{id}")]
    //public void Delete(int id)
    //{
    //}
}
