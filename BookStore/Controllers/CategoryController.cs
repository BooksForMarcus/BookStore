namespace BookStore.Controllers;

using BookStore.DbAccess;
using BookStore.Models;
using Microsoft.AspNetCore.Mvc;
//using System.Web.Http;

[Route("api/[controller]")]
//[Route("api/[controller]")]
[ApiController]
public class CategoryController : ControllerBase
{
    private readonly CategoryCrud _categoryCrud;

    public CategoryController(CategoryCrud categoryCrud) =>
        _categoryCrud = categoryCrud;


    // GET: api/<CategoryController>
    [HttpGet]
    public async Task<IEnumerable<Category>> Get()
    {
        return await _categoryCrud.GetAllCategories();
    }

    //[Route("api/[controller]/one/{id:guid}/")]
    //[Route("{id:guid}")]
    //public async Task<Category> Get(Guid id)
    //{
    //    return await _categoryCrud.GetCategory(id);
    //}




    [HttpPost]
    public async Task<IActionResult> Post(Category category)
    {

        var result = await _categoryCrud.CreateCategory(category);
        if (result) return Ok();
        else return BadRequest();
    }







    public async Task<IActionResult> Delete(Category category)
    {
        var result = await _categoryCrud.DeleteCategory(category);
        if (result) return Ok();
        return BadRequest();
    }


}

