namespace BookStore.Models;

public class BookOperation
{
    public string User { get; set; } = "";
    public string Password { get; set; } = "";
    public Book Book { get; set; } = new Book();
}
