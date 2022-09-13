namespace BookStore.DTO;

using BookStore.Models;

public class CustomerOperation
{
    public string Email { get; set; }
    public string Password { get; set; }
    public Customer CustomerToUpdate { get; set; } = new Customer();
}
