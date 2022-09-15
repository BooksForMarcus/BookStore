﻿namespace BookStore.Models;

using MongoDB.Bson.Serialization.Attributes;

public class Book
{
    [BsonId]
    [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
    public string Id { get; set; } = "";
    public string ISBN { get; set; } = "";
    public string Author { get; set; } = "";
    public string Title { get; set; } = "";
    public string Language { get; set; } = "";
    public string[] Categories { get; set; } = Array.Empty<string>();
    public int NumInstock { get; set; } = 1;
    public decimal Price { get; set; } = 100.0M;
    public int Year { get; set; } = 1;
    public string SoldBy { get; set; } = "";
    public string ImageURL { get; set; } = "";
}