namespace BookStore.Models;

using MongoDB.Bson.Serialization.Attributes;

public class Customer
{
    [BsonId]
    [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
    public string Id { get; set; } = "";
    public string Email { get; set; } = "";
    public string Password { get; set; } = "";
    public string FirstName { get; set; } = "";
    public string LastName { get; set; } = "";
    public string Address { get; set; } = "";
    public bool IsActive { get; set; } = true;
    public bool IsBlocked { get; set; } = false;
    public bool IsAdmin { get; set; } = false;
    public bool IsSeller { get; set; } = false;
}
