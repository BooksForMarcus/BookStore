namespace BookStore.Controllers;

using BookStore.DbAccess;
using BookStore.Models;
using Microsoft.AspNetCore.Mvc;
using BookStore.Authorize;

[Authorize]
[Route("api/[controller]")]
[ApiController] 
public class CategoryController : ControllerBase
{
    private readonly CategoryCrud _categoryCrud;

    public CategoryController(CategoryCrud categoryCrud) =>
        _categoryCrud = categoryCrud;
    /// <summary>
    /// gets a list of all the books. does npot require login.
    /// </summary>
    /// <returns></returns>

    [HttpGet]
    [AllowAnonymous]
    public async Task<IEnumerable<Category>> Get()
    {
        return await _categoryCrud.GetAllCategories();
    }
    /// <summary>
    /// Creates a new category. Requires Admin privileges.
    /// </summary>
    /// <param name="category"></param>
    /// <returns></returns>
    /// <response code="200">It worked. The response body contains the Id of the created book</response>
    /// <response code="400">it didnt work. check body for hints as to why this might be.</response>
    /// <response code="500">Programmeraren har klantat sig</response> 
    [HttpPost]
    public async Task<IActionResult> Post(Category category)
    {

        var cust = HttpContext.Items["Customer"] as Customer;
        if (cust.IsAdmin)
        {
            var result = await _categoryCrud.CreateCategory(category);
            if (!String.IsNullOrEmpty(result)) return Ok(result);
            else return BadRequest("la categorie n'a pas ete crée");
        }
        else
        {
            return BadRequest( "Sie mussen Admin-privilegien haben, um ein neue kategorie zu shaffen" );
        }
        return Ok();
    }
    /// <summary>
    /// Delete a category. Requires Admin privileges.
    /// </summary>
    /// <param name="category"></param>
    /// <returns></returns>
    /// <response code="200">It worked. </response>
    /// <response code="400">it didnt work. check body for hints as to why this might be.</response>
    /// <response code="500">Programmeraren har klantat sig</response> 
    [HttpDelete]
    public async Task<IActionResult> Delete(Category category)
    {
        var cust = HttpContext.Items["Customer"] as Customer;
        if (cust.IsAdmin)
        {
            var result = await _categoryCrud.DeleteCategory(category);
            if (result) return Ok("deleted");
            else return BadRequest("la categoria non era cancellato");
        }
        else
        {
            return BadRequest(new { error = "Need admin priviledge to delete category." });
        }
    }
    /// <summary>
    /// Update a Category. Requires Admin privileges.
    /// </summary>
    /// <param name="category"></param>
    /// <returns></returns>
    /// <response code="200">It worked. Body contains Id of updated category.</response>
    /// <response code="400">it didnt work. check body for hints as to why this might be.</response>
    /// <response code="500">Programmeraren har klantat sig</response> 
    [HttpPut]
    public async Task<IActionResult> Put(Category category)
    {
        var cust = HttpContext.Items["Customer"] as Customer;
        if (cust.IsAdmin)
        {
            var result = await _categoryCrud.UpdateCategory(category);
            if (!String.IsNullOrEmpty(result)) return Ok(result);
            else return BadRequest("category not updated");

        }
        else
        {
            return BadRequest(" you are not admin, get out!");
        }
    }
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCat(string id) 
    {
        var cust = HttpContext.Items["Customer"] as Customer;
        if (cust.IsAdmin)
        {
            var myCat = _categoryCrud.GetMyCategory(id);
            if (myCat != null)
            {
                var result = await _categoryCrud.DeleteCategory(myCat);
                if (result) return Ok(id + " deleted");
                else return BadRequest("la categoria non era cancellato");
            }
            return BadRequest("null luck");
        }
        else
        {
            return BadRequest(new { error = "Need admin priviledge to delete category." });
        }
 
    }


}

