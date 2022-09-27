namespace BookStore.DTO;

using BookStore.Models;

public class CustomerOperation
{
    public string Id { get; set; } = "";
    public bool IsAdmin { get; set; } = false;
    public Customer CustomerToUpdate { get; set; } = new Customer();
}
