namespace BookStore.Controllers;

using BookStore.DbAccess;
using BookStore.Models;
using Microsoft.AspNetCore.Mvc;
using BookStore.Authorize;
//using System.Web.Http;

[Route("api/[controller]")]
//[Route("api/[controller]")]
[ApiController]
[Authorize]
public class CategoryController : ControllerBase
{
    private readonly CategoryCrud _categoryCrud;

    public CategoryController(CategoryCrud categoryCrud) =>
        _categoryCrud = categoryCrud;


    // GET: api/<CategoryController>
    [HttpGet]
    [AllowAnonymous]
    public async Task<IEnumerable<Category>> Get()
    {
        return await _categoryCrud.GetAllCategories();
    }

    [HttpPost]
    public async Task<IActionResult> Post(Category category)
    {

        var cust = HttpContext.Items["Customer"] as Customer;
        if (cust is not null && cust.IsAdmin)
        {
            var result = await _categoryCrud.CreateCategory(category);
            if (result) return Ok();
            else return BadRequest();

        }
        else
        {
            return BadRequest(new { error = "Need admin priviledge to create category." });
        }

        return Ok();
    }






    [HttpDelete]
    public async Task<IActionResult> Delete(Category category)
    {
        var cust = HttpContext.Items["Customer"] as Customer;
        if (cust is not null && cust.IsAdmin)
        {
            var result = await _categoryCrud.DeleteCategory(category);
            if (result) return Ok();
            else return BadRequest();

        }
        else
        {
            return BadRequest(new { error = "Need admin priviledge to delete category." });
        }


        ////var result = await _categoryCrud.DeleteCategory(category);
        ////if (result) return Ok();
        return BadRequest();
    }


}

