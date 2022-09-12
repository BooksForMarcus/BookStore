namespace BookStore.Controllers;

using BookStore.DbAccess;
using BookStore.DTO;
using BookStore.Models;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

[Route("api/[controller]")]
[ApiController]
public class CustomerController : ControllerBase
{
    private readonly CustomerCrud _customerCrud;

    public CustomerController(CustomerCrud customerCrud) =>
        _customerCrud = customerCrud;


    // GET: api/<CustomerController>
    [HttpPost("admin/getusers")]
    public async Task<IEnumerable<Customer>> GetUsers(CustomerAuthorize auth)
    {
        return await _customerCrud.AdminGetAllCustomers(auth);
    }


    // POST api/<CustomerController>
    [HttpPost]
    public async Task<IActionResult> Post(Customer customer)
    {
        var result = await _customerCrud.CreateCustomer(customer);
        if (result.Success) return Ok();
        else return BadRequest(result);
    }

    [HttpPut("updatecustomer")]
    public async Task<IActionResult> Put(CustomerOperation op)
    {
        var result = await _customerCrud.UpdateCustomer(op);
        return result is not null ? Ok() : BadRequest();
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
