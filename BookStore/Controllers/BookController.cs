namespace BookStore.Controllers;

using BookStore.DbAccess;
using BookStore.Models;
using Microsoft.AspNetCore.Mvc;
using BookStore.Authorize;
//using System.Web.Http;

[Route("api/[controller]")]
//[Route("api/[controller]")]
[ApiController]
public class BookController : ControllerBase
{
    private readonly BookCrud _bookCrud;
    private readonly CustomerCrud _customerCrud;
    private readonly CategoryCrud _categoryCrud;

    public BookController(BookCrud bookCrud, CustomerCrud cc, CategoryCrud cac) 
    {
        _bookCrud = bookCrud;
        _customerCrud = cc;
        _categoryCrud = cac;

    }
    /// <summary>
    /// Hämtar boklista. Ingen login krävs.
    /// </summary>
    /// <returns>lista med böcker</returns>
    [HttpGet]
    [AllowAnonymous]
    public async Task<IEnumerable<Book>> Get()
    {
        return await _bookCrud.GetAllBooks();
    }
    /// <summary>
    /// Skapa Bok. Endast Admin.
    /// </summary>
    /// <param name="book"> Boken att skapa</param>
    /// <returns>???????</returns>
    /// <response code="200">Boken skapad</response>
    /// <response code="400">Boken inte skapad</response>
    /// <response code="500">Programmeraren har klantat sig</response> 
    [HttpPost]
    public async Task<IActionResult> Post(Book book)
    {

        var cust = HttpContext.Items["Customer"] as Customer;
        if (cust is not null && cust.IsAdmin)
        {
            var result = await _bookCrud.CreateBook(book);
            if (result) return Ok();
            else return BadRequest();

        }
        else
        {
            return BadRequest(new { error = "Need admin priviledge to create book." });
        }

        //////////////////
        ////var result = await _bookCrud.CreateBook(book);
        ////if (result) return Ok();
        ////else return BadRequest();

        return Ok();
    }

    /// <summary>
    /// Redigera Bok.Endast Admin
    /// </summary>
    /// <param name="book">boken i fråga</param>
    /// <returns></returns>
    /// <response code="200">Boken redigerad</response>
    /// <response code="400">Boken inte redigerad</response>
    /// <response code="500">Programmeraren har klantat sig</response> 
    [HttpPut]
    public async Task<IActionResult> Put(Book book)
    {
        var cust = HttpContext.Items["Customer"] as Customer;
        if (cust is not null && cust.IsAdmin)
        {
            var result = await _bookCrud.UpdateBook(book);
            if (result) return Ok();
            else return BadRequest();

        }
        else
        {
            return BadRequest(new { error = "Need admin priviledge to edit book." });
        }


        ////var result = await _bookCrud.UpdateBook(book);
        ////if (result !=null && !String.IsNullOrWhiteSpace(result.Id)) return Ok();
        return BadRequest();
    }


    [HttpDelete]
 

    public async Task<IActionResult> Delete(Book book)
    {
        var cust = HttpContext.Items["Customer"] as Customer;
        if (cust is not null && cust.IsAdmin)
        {
            var result = await _bookCrud.DeleteBook(book);
            if (result) return Ok();
            else return BadRequest();

        }
        else
        {
            return BadRequest(new { error = "Need admin priviledge to delete book." });
        }


        ////var result = await _bookCrud.DeleteBook(book);
        ////if (result) return Ok();
        return BadRequest();
    }

    //// DELETE api/<CustomerController>/5
    //[HttpDelete("{id}")]
    //public void Delete(int id)
    //{
    //}
}

