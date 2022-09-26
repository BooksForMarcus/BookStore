namespace BookStore.Controllers;

using BookStore.DbAccess;
using BookStore.Models;
using Microsoft.AspNetCore.Mvc;
using BookStore.Authorize;
 
[Authorize]
[Route("api/[controller]")]
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
    /// Skapa Bok. Måste vara admin och/eller stå som säljare av boken.
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
        if (cust.IsAdmin || cust.Id == book.SoldById)
        {
            var result = await _bookCrud.CreateBook(book);
            if (!String.IsNullOrEmpty(result)) return Ok(result);
            else return BadRequest("Bok ej skapad");
        }
        else
        { 
            return BadRequest(new { error = "You cannot create books for sellers other than yourself unless you are an Admin\n" +
                "(and you probably shouldn't even if you are)" });
        }
    }

    /// <summary>
    /// Redigera Bok. Måste vara admin och/eller stå som säljare av boken.
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
        if (cust.IsAdmin || cust.Id == book.SoldById)
        {
            var result = await _bookCrud.UpdateBook(book);
            if (!String.IsNullOrEmpty(result)) return Ok(result);
            else return BadRequest("book not updated");

        }
        else
        {
            return BadRequest(new
            {
                error = "You cannot update books for sellers other than yourself unless you are an Admin\n" +
                "(and you probably shouldn't even if you are)"
            });
        }
    }
    /// <summary>
    ///  Delete book. Users can only delete their own books.
    /// </summary>
    /// <param name="book"></param>
    /// <returns></returns>
    /// <response code="200">Boken deleted</response>
    /// <response code="400">Boken not deleted</response>
    /// <response code="500">Programmeraren has clanted himself</response> 
    /// <remarks>endast Idfältet & SoldbyId måste skickas</remarks>
    [HttpDelete]
    public async Task<IActionResult> Delete(Book book)
    {
        var cust = HttpContext.Items["Customer"] as Customer;
        if (cust.IsAdmin || cust.Id == book.SoldById)
        {
            var result = await _bookCrud.DeleteBook(book);
            if (result) return Ok("deleted");
            else return BadRequest("not deleted");

        }
        else
        {
            return BadRequest(new { error = "You can only delete your own books, if nonadmin" });
        }
    }
}

