namespace BookStore.Models;

public class BookOperation
{
    public string Email { get; set; } = "";
    public string Password { get; set; } = "";
    public Book Book { get; set; } = new Book();
}
