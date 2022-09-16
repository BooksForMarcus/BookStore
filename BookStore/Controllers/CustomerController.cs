namespace BookStore.Controllers;

using BookStore.Authorize;
using BookStore.DbAccess;
using BookStore.DTO;
using BookStore.Models;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using System.Net.Http.Headers;
using System.Text;
using static Helpers.EnvironmentHelper;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class CustomerController : ControllerBase
{
    private readonly CustomerCrud _customerCrud;

    public CustomerController(CustomerCrud customerCrud) =>
        _customerCrud = customerCrud;

    /// <summary>
    /// Gets a list of all the customer. (Basic Auth required).
    /// </summary>
    /// <returns>A List of all the customers.</returns>
    /// <response code="200">Call ok.</response>
    [HttpGet("admin/getusers")]
    public async Task<IActionResult> AdminGetUsers()
    {
        var cust = HttpContext.Items["Customer"] as Customer;
        if (cust is not null && cust.IsAdmin)
        {
            return Ok(await _customerCrud.AdminGetAllCustomers());
        }
        else
            return BadRequest(new { error = "Need admin priviledge to access customer list." });
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

    /// <summary>
    /// Updates customer.
    /// </summary>
    /// <param name="op">Should contain email and password of the user trying to make
    /// the change, as well as the customerToUpdate object containing the current information.</param>
    /// <returns></returns>
    /// <response code="200">Customer update ok. Will also return the changed customer object.</response>
    /// <response code="400">Failed to update customer.</response>
    /// <remarks>IMPORTANT: if done by admin, will use the posted customerToUpdate object to replace the information in the DB.
    /// If done by non-Admin, will only update password, first name, last name or address fields.</remarks>
    [HttpPut("updatecustomer")]
    public async Task<IActionResult> Put(Customer customer)
    {
        var cust = HttpContext.Items["Customer"] as Customer;
        Customer result = null;
        if (cust is not null)
        {
            var op = new CustomerOperation
            {
                CustomerToUpdate = customer,
                Email = cust.Email,
                Password = cust.Password
            };
            if (cust.IsAdmin)
            {
                result = await _customerCrud.AdminUpdateCustomer(op);
            }
            else
            {
                //todo: implement this method for real:
                result = await _customerCrud.CustomerUpdateSelf(op);
            }
        }
        return result is not null ? Ok(result) : BadRequest();
    }


    /// <summary>
    /// If done by an Admin, will remove customer from database, otherwise will set account to IsActive = false
    /// </summary>
    /// <param name="op">Should contain email and password of the user trying to make
    /// the change, as well as the (in the customerToUpdate object) the id of the
    /// customer to delete.</param>
    /// <returns></returns>
    /// <response code="200">Customer remove/deactivate ok.</response>
    /// <response code="400">Failed to remove/deactivate customer.</response>
    /// <remarks>The only information used from the customerToUpdate object is the Id,
    /// the remaining information should be left out. BE ADVISED: admin can *not* remove themselves from DB.</remarks>
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
        return result is null ? BadRequest() : Ok(result);
    }
    [AllowAnonymous]
    [HttpGet("login/")]
    public async Task<IActionResult> GetLogin()
    {
        HttpContext httpContext = HttpContext.Request.HttpContext;

        string authHeader = httpContext.Request.Headers["Authorization"];
        var auth = new CustomerAuthorize();
        if (authHeader != null && authHeader.StartsWith("Basic"))
        {
            string encodedUsernamePassword = authHeader.Substring("Basic ".Length).Trim();
            Encoding encoding = Encoding.GetEncoding("iso-8859-1");
            string usernamePassword = encoding.GetString(Convert.FromBase64String(encodedUsernamePassword));

            int seperatorIndex = usernamePassword.IndexOf(':');

            auth.Email = usernamePassword.Substring(0, seperatorIndex);
            auth.Password = usernamePassword.Substring(seperatorIndex + 1);
        }
        else
        {
            //Handle what happens if that isn't the case
            throw new Exception("The authorization header is either empty or isn't Basic.");
        }
        var result = await _customerCrud.Login(auth);
        return result is null ? BadRequest() : Ok(result);
    }
}
