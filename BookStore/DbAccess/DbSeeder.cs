namespace BookStore.DbAccess;

using BookStore.Models;
using MongoDB.Driver;
using System;
using static System.Text.Json.JsonSerializer;

public class DbSeeder
{
    private readonly MongoClient client = new MongoClient("mongodb://localhost:27017");
    private readonly IMongoDatabase db;
    private const string databaseName = "BookstoreXYZ";
    private const string customerCollection = "Customers";
    private const string booksCollection = "Books";
    private const string ordersCollection = "Orders";
    private const string categoriesCollection = "Categories";
    private const string customersFile = "customers.json";
    private const string booksFile = "Books220930.json";
    private const string ordersFile = "orders.json";
    private const string categoriesFile = "Categories.json";
    private const string path = "./DbAccess/Seeds/";

    public DbSeeder()
    {
        db = client.GetDatabase(databaseName);
    }

    public async Task Seed()
    {
        if (File.Exists(path + customersFile)) await SeedCustomers();
        if (File.Exists(path + booksFile)) await SeedBooks();
        if (File.Exists(path + categoriesFile)) await SeedCategories();
        if (File.Exists(path + ordersFile)) await SeedOrders();
    }
    private async Task SeedOrders()
    {
        var orders = db.GetCollection<Order>(ordersCollection);
        if (IsCollectionMissing(ordersCollection) || IsCollectionEmpty(ordersCollection))
        {
            var ordersList = ImportJsonList<Order>(ordersFile);
            await orders.InsertManyAsync((List<Order>)ordersList);
        }
    }
    private async Task SeedCategories()
    {
        var categories = db.GetCollection<Category>(categoriesCollection);
        if (IsCollectionMissing(categoriesCollection) || IsCollectionEmpty(categoriesCollection))
        {
            var categoriesList = ImportJsonList<Category>(categoriesFile);
            await categories.InsertManyAsync((List<Category>)categoriesList);
        }
    }
    private async Task SeedBooks()
    {
        var books = db.GetCollection<Book>(booksCollection);
        if (IsCollectionMissing(booksCollection) || IsCollectionEmpty(booksCollection))
        {
            var booksList = ImportJsonList<Book>(booksFile);
            await books.InsertManyAsync((List<Book>)booksList);
        }
    }

    private List<T> ImportJsonList<T>(string fileName)
    {
        var fileTxt = File.ReadAllText(path + fileName);
        var list = Deserialize(fileTxt, typeof(List<T>));
        return list as List<T>;
    }

    private async Task SeedCustomers()
    {
        var customers = db.GetCollection<Customer>(customerCollection);
        if (IsDbMissing() || IsCollectionMissing(customerCollection) || IsCollectionEmpty(customerCollection))
        {
            var customerList = ImportJsonList<Customer>(customersFile);
            await customers.InsertManyAsync((List<Customer>)customerList);

            var customerIndexBuilder = Builders<Customer>.IndexKeys;
            var mailIndex = new CreateIndexModel<Customer>(customerIndexBuilder.Ascending(x => x.Email));
            await customers.Indexes.CreateOneAsync(mailIndex);
        }
    }

    private bool IsCollectionEmpty(string collectionName)
    {
        var collection = db.GetCollection<Customer>(collectionName);
        return collection.EstimatedDocumentCount() == 0;
    }

    private bool IsCollectionMissing(string collectionName)
    {
        {
            var collections = db.ListCollectionNames().ToList();
            return !collections.Contains(collectionName);
        }
    }

    private bool IsDbMissing()
    {
        var dbList = client.ListDatabases().ToList().Select(db => db.GetValue("name").AsString);
        return !dbList.Contains(databaseName);
    }
}
