namespace BookStore.Controllers;

using BookStore.DbAccess;
using BookStore.DTO;
using BookStore.Models;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using System.Net.Http.Headers;
using static Helpers.EnvironmentHelper;

[Route("api/[controller]")]
[ApiController]
public class CustomerController : ControllerBase
{
    private readonly CustomerCrud _customerCrud;

    public CustomerController(CustomerCrud customerCrud) =>
        _customerCrud = customerCrud;

    /// <summary>
    /// Post a valid admin e-mail and password to get a list of all the users.
    /// </summary>
    /// <param name="auth">Object containing email and password.</param>
    /// <returns>A List of all the customers.</returns>
    /// <response code="200">Call ok.</response>
    [HttpPost("admin/getusers")]
    public async Task<IEnumerable<Customer>> GetUsers(CustomerAuthorize auth)
    {
        return await _customerCrud.AdminGetAllCustomers(auth);
    }

    /// <summary>
    /// Post an object to create a new customer.
    /// </summary>
    /// <param name="customer">Object containing information about the new customer.</param>
    /// <returns>A List of all the customers.</returns>
    /// <response code="200">Customer created ok.</response>
    /// <response code="400">Failed to create a new customer.</response>
    /// <remarks>The only information used from the posted object is the email,
    /// first name and last name fields, all other fields can(and should) be left out.</remarks>
    [HttpPost]
    public async Task<IActionResult> Post(Customer customer)
    {
        var result = await _customerCrud.CreateCustomer(customer);
        if (result.Success) return Ok(result);
        else return BadRequest(result);
    }

    //Needs xml!
    [HttpPut("updatecustomer")]
    public async Task<IActionResult> Put(CustomerOperation op)
    {
        var result = await _customerCrud.UpdateCustomer(op);
        return result is not null ? Ok() : BadRequest();
    }


    //Takes a.... write xml!
    [HttpDelete]
    public async Task<IActionResult> Delete(CustomerOperation op)
    {
        var result = await _customerCrud.DeleteCustomer(op);
        if (result) return Ok();
        else return BadRequest();
    }

    /// <summary>
    /// Attempts to login with an object containing email and password.
    /// </summary>
    /// <param name="auth">Object containing email and password.</param>
    /// <returns></returns>
    /// <response code="200">Login in ok.</response>
    /// <response code="400">Login failed.</response>
    /// <remarks>Attempts to login using the given email and password,
    /// will return the customer object if credentials matches and the customer is flagged
    /// as active, otherwise will return null.</remarks>
    [HttpPost("login/")]
    public async Task<IActionResult> Login(CustomerAuthorize auth)
    {
        var result = await _customerCrud.Login(auth);
        return result is null?BadRequest():Ok(result);
    }
}
