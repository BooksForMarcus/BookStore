namespace BookStore.Controllers;

using BookStore.DbAccess;
using BookStore.Models;
using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
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
        if (result) return Ok();
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

    //// DELETE api/<CustomerController>/5
    //[HttpDelete("{id}")]
    //public void Delete(int id)
    //{
    //}
}

