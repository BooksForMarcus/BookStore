namespace BookStore.DbAccess;

using BookStore.Models;
using MongoDB.Driver;

public class MongoDbAccess
{
    private readonly string connectionString;

    private const string databaseName = "Bookstore";
    private const string customerCollection = "Customers";
    private const string booksCollection = "Books";
    private const string ordersCollection = "Orders";

    public IMongoCollection<Customer> CustomersCollection { get => MongoConnect<Customer>(customerCollection); }
    public IMongoCollection<Book> BooksCollection { get => MongoConnect<Book>(booksCollection); }

    public MongoDbAccess()
    {
        var isDev = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development";
        connectionString = isDev ? "mongodb://localhost:27017" : Environment.GetEnvironmentVariable("CUSTOMCONNSTR_mongodb")!;
    }

    private IMongoCollection<T> MongoConnect<T>(string collection)
    {
        var client = new MongoClient(connectionString);
        var db = client.GetDatabase(databaseName);
        return db.GetCollection<T>(collection);
    }
}
