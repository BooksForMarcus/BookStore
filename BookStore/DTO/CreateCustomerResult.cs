namespace BookStore.DTO;

public class CreateCustomerResult
{
    public bool Success { get; set; } = false;
    public bool MailAvailable { get; set; } = false;
    public bool ValidMail { get; set; } = false;
    public bool ValidFirstName { get; set; } = false;
    public bool ValidLastName { get; set; } = false;
    public bool DbCreateSucceeded { get; set; } = false;
    public bool UserObjectWasNull { get; set; } = false;
    public string DevPass { get; set; } = "";
}
