namespace BookStore.DTO;

using BookStore.Models;

public class LoginResponse
{
    public bool Success { get; set; } = false;
    public bool UserFound { get; set; } = false;
    public bool ValidPassword { get; set; } = false;
    public bool IsBlocked { get; set; } = false;
    public Customer User { get; set; } = new();
}
