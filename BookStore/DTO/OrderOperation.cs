using BookStore.Models;

namespace BookStore.DTO
{
    public class OrderOperation
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public Order OrderToUpdate { get; set; } = new Order();
    }
}
