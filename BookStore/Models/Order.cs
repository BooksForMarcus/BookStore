using MongoDB.Bson.Serialization.Attributes;

namespace BookStore.Models
{
    public class Order
    {
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string Id { get; set; } = "";
        public Customer Customer { get; set; } = new Customer();
        public string Ordernumber { get => Id; }
        public DateTime Date { get; set; } = DateTime.Now;
        public decimal OrderSum { get; set; } = 0;
        public decimal VAT { get; set; } = 0;
        public List<Book> books { get; set; } = new List<Book>();
    }
}
