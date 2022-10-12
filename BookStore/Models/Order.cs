using BookStore.Enums;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json.Serialization;

namespace BookStore.Models
{
    public class Order
    {
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string Id { get; set; } = "";
        public Customer Customer { get; set; } = new Customer();

        public string Ordernumber { get => Id; }

        [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
        [BsonRepresentation(BsonType.DateTime)]
        public DateTime Date { get; set; } = DateTime.Now;

        /// <summary>
        /// Gets or sets the order sum, the amount is total book prices + postage (incl. VAT).
        /// </summary>
        /// <value>
        /// The total amount to be paid by the customer for this order (books and postage).
        /// </value>
        [BsonRepresentation(BsonType.Decimal128)]
        public decimal OrderSum { get; set; } = 0;

        [BsonRepresentation(BsonType.Decimal128)]
        public decimal Postage { get; set; } = 0;

        /// <summary>
        /// Gets or sets the VAT, calculated by taking the sum of the price of all books times 0.06 and then add postage times 0.25.
        /// </summary>
        /// <value>
        /// How much of the <see cref="OrderSum"/> that is VAT.
        /// </value>
        [BsonRepresentation(BsonType.Decimal128)]
        public decimal VAT { get; set; } = 0;

        public List<Book> books { get; set; } = new List<Book>();

        [JsonConverter(typeof(JsonStringEnumConverter))]  // System.Text.Json.Serialization
        [BsonRepresentation(BsonType.String)]
        public OrderStatus Status { get; set; } = OrderStatus.Pending;
        public List<Seller> Sellers { get; set; } = new();
    }
}
