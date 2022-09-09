namespace BookStore.Controllers;

using BookStore.DbAccess;
using BookStore.Models;
using Microsoft.AspNetCore.Mvc;
//using System.Web.Http;

[Route("api/[controller]")]
//[Route("api/[controller]")]
[ApiController]
public class BookController : ControllerBase
{
    private readonly BookCrud _bookCrud;

    public BookController(BookCrud bookCrud) =>
        _bookCrud = bookCrud;


    // GET: api/<BookController>
    [HttpGet]
    public async Task<IEnumerable<Book>> Get()
    {
        return await _bookCrud.GetAllBooks();
    }

    //[Route("api/[controller]/one/{id:guid}/")]
    //[Route("{id:guid}")]
    //public async Task<Book> Get(Guid id)
    //{
    //    return await _bookCrud.GetBook(id);
    //}

    //// GET api/<CustomerController>/5
    //[HttpGet("{id}")]
    //public string Get(int id)
    //{
    //    return "value";
    //}

    // POST api/<CustomerController>
    [HttpPost]
    public async Task<IActionResult> Post(Book book)
    {
 
        var result = await _bookCrud.CreateBook(book);
        if (result) return Ok ();
        else return BadRequest();
    }

    //// PUT api/<CustomerController>/5
    //[HttpPut("{id}")]
    //public void Put(int id, [FromBody] string value)
    //{
    //}
    [HttpPut]
    public async Task<IActionResult> Put(Book book)
    {
        var result = await _bookCrud.UpdateBook(book);
        if (!String.IsNullOrWhiteSpace(result.Id)) return Ok();
        return BadRequest();
    }



    //pattern: "{controller}/{action=Index}/{id?}");
    //kan man göra så här?

    //[Route("api/[controller]/{id}/{newPrice}")]
    //public async Task<IActionResult> Put(Guid id, decimal newPrice)
    //{
    //    var result = await _bookCrud.UpdateBookPrice(id, newPrice);
    //    if (result) return Ok();
    //    return BadRequest();
    //}

    //[Route("api/[controller]/stock/{id}/")]

    //public async Task<IActionResult> Put(Guid id, [FromBody] int newStock)
    //{
    //    var result = await _bookCrud.UpdateBookInventory(id, newStock);
    //    if (result) return Ok();
    //    return BadRequest();
    //}

    [HttpDelete]
    //public async Task<IActionResult> Delete(Guid id)
    //{
    //    var result = await _bookCrud.DeleteBook(id);
    //    if (result) return Ok();
    //    return BadRequest();
    //}

    public async Task<IActionResult> Delete(Book book)
    {
        var result = await _bookCrud.DeleteBook(book);
        if (result) return Ok();
        return BadRequest();
    }

    //// DELETE api/<CustomerController>/5
    //[HttpDelete("{id}")]
    //public void Delete(int id)
    //{
    //}
}

