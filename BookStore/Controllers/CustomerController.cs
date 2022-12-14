namespace BookStore.Controllers;

using BookStore.Authorize;
using BookStore.DbAccess;
using BookStore.DTO;
using BookStore.Helpers;
using BookStore.Models;
using Microsoft.AspNetCore.Mvc;
using System.Text;

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
    /// Post an object to create a new customer (Basic Auth NOT required).
    /// </summary>
    /// <param name="customer">Object containing information about the new customer.</param>
    /// <returns>A List of all the customers.</returns>
    /// <response code="200">Customer created ok.</response>
    /// <response code="400">Failed to create a new customer.</response>
    /// <remarks>The only information used from the posted object is the email,
    /// first name and last name fields, all other fields can(and should) be left out.</remarks>
    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> Post(Customer customer)
    {
        var result = await _customerCrud.CreateCustomer(customer);
        if (result.Success) return Ok(result);
        else return BadRequest(result);
    }

    /// <summary>
    /// Updates customer (Basic Auth required).
    /// </summary>
    /// <returns>The replaces Customer object on success, otherwise null. ATTENTION: returns the *replaced* object, not the current!</returns>
    /// <response code="200">Customer update ok. Will also return the changed customer object.</response>
    /// <response code="400">Failed to update customer.</response>
    /// <remarks>IMPORTANT: if done by admin, will use the posted <see cref="Customer"/> object to replace the information in the DB.
    /// If done by non-Admin, will only update password, first name, last name or address fields.</remarks>
    [HttpPut("updatecustomer")]
    public async Task<IActionResult> Put(Customer customer)
    {
        var auth = HttpContext.Items["Customer"] as Customer;
        Customer result = null!;
        if (auth is not null)
        {
            var op = new CustomerOperation
            {
                CustomerToUpdate = customer,
                Id = auth.Id,
                IsAdmin = auth.IsAdmin
            };
            if (auth.IsAdmin && !string.IsNullOrEmpty(customer.Id))
            {
                result = (await _customerCrud.AdminUpdateCustomer(op))!;
            }
            else
            {
                result = (await _customerCrud.CustomerUpdateSelf(op))!;
            }
        }
        return result is not null ? Ok(result) : BadRequest();
    }

    /// <summary>
    /// If done by an Admin, will remove customer from database, otherwise will set account to IsActive = false (Auth required).
    /// </summary>
    /// <param name="customerToDelete">Only field used from customer object is Id.</param>
    /// <response code="200">Customer remove/deactivate ok.</response>
    /// <response code="400">Failed to remove/deactivate customer.</response>
    /// <remarks>The only information used from the customerToUpdate object is the Id,
    /// the remaining information should be left out. BE ADVISED: admin can *not* remove themselves from DB.</remarks>
    [HttpDelete]
    public async Task<IActionResult> Delete(Customer customerToDelete)
    {
        var auth = HttpContext.Items["Customer"] as Customer;
        if ((auth.IsAdmin && auth.Id != customerToDelete.Id) || (!auth.IsAdmin && auth.Id == customerToDelete.Id))
        {
            var op = new CustomerOperation()
            {
                Id = auth.Id,
                IsAdmin = auth.IsAdmin,
                CustomerToUpdate = customerToDelete
            };
            var result = await _customerCrud.DeleteCustomer(op);
            if (result) return Ok();
        }
        return BadRequest();
    }

    /// <summary>
    /// Login requires the name + password to be set in the Authorization header.
    /// </summary>
    /// <returns>The user object for the logged in user</returns>
    /// <exception cref="System.Exception">The authorization header is either empty or isn't Basic.</exception>
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

    /// <summary>
    /// Will reset and send a new password to the customer.
    /// </summary>
    /// <param name="forgetful"><see cref="Customer"/> object containing email of the forgetful customer.</param>
    /// <remarks>The only field used from the customer object is email, the rest can and should be left blank. In fact, posting an object just containing a email field is encouraged.</remarks>
    /// <returns></returns>
    [HttpPost("forgotpassword/")]
    [AllowAnonymous]
    public async Task<IActionResult> ForgotPassword(Customer forgetful)
    {
        var result = await _customerCrud.PasswordReset(forgetful);
        if (result && EnvironmentHelper.IsDev) return Ok(new {password=forgetful.Password});
        else return result ? Ok(new { response= "mail sent."}) : BadRequest();
    }
}