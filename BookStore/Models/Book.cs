namespace BookStore.Models;

using MongoDB.Bson.Serialization.Attributes;

public class Book
{
    [BsonId]
    [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
    public string Id { get; set; } = "";  //olika för beg böcker & nya

    public Guid[] IdenticalWith { get; set; } = new Guid[] { };
    public string Author { get; set; } = "";
    public string Title { get; set; } = "";
    public string Language { get; set; } = "";
    public string[] Categories { get; set; } = new string[] { };

    public int NumInstock { get; set; } = 1; //Alltid 1
    public decimal Price { get; set; } = 1;
    public int Year { get; set; } = 1;

    public Guid? SoldBy  { get; set; } //defaulta till bookstorens userid...
}

