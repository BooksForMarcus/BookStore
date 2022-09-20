using MongoDB.Bson.Serialization.Attributes;

namespace BookStore.Models
{
    public class Order
    {
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string Id { get; set; } = "";
        public string CustomerId { get; set; } = "";
        public string CustomerName { get; set; } = "";
        public string Date { get; set; } = "";
        public decimal OrderSum { get; set; } = 0;
        public decimal VAT { get; set; } = 0;
        public List<Book> books { get; set; } = new List<Book>();

    }
}
