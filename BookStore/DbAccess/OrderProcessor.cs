namespace BookStore.DbAccess;

using BookStore.Helpers;
using BookStore.Models;
using MongoDB.Driver;
using System;

public class OrderProcessor
{
    private readonly IMongoCollection<Order> _orders;
    private readonly IMongoCollection<Customer> _customers;
    private readonly IMongoCollection<Book> _books;
    private readonly IMongoCollection<Category> _categories;
    private Order _order;

    public OrderProcessor(MongoDbAccess db)
    {
        _orders = db.OrdersCollection;
        _customers = db.CustomersCollection;
        _books = db.BooksCollection;
        _categories = db.CategoriesCollection;
    }

    public async Task<Order> Process(Order order)
    {
        _order = order;
        await ValidateAndUpdateOrderAndBooks();
        await GenerateSellerObjects();
        //await MailExternalSellers();


        //maila varje säljare med vilka böcker
        return _order;
    }

    private async Task GenerateSellerObjects()
    {
        //hitta distinkta säljare som inte är store
        var sellerIds = _order.books.Select(b => b.SoldById).Distinct().Where(s => s != "store").ToList();
        foreach (var id in sellerIds)
        {
            if (id != "store")
            {
                var user = (await _customers.FindAsync(c => c.Id == id)).FirstOrDefault();
                if (user != null)
                {
                    var seller = new Seller
                    {
                        Id = user.Id,
                        Email = user.Email,
                        FirstName = user.FirstName,
                        LastName = user.LastName
                    };
                    _order.Sellers.Add(seller);
                }
            }
        }
    }

    private async Task MailExternalSellers()
    {
        //hitta distinkta säljare som inte är store
        var sellers = _order.books.Select(b => b.SoldById).Distinct().Where(s => s != "store").ToList();
        //sortera ut böcker per säljare
        foreach (var seller in sellers)
        {
            var sellerBooks = _order.books.Where(b => b.SoldById == seller).ToList();
            //finish writing this method
        }
        //finish writing this method
        //finish writing this method
        //finish writing this method
    }

    private async Task ValidateAndUpdateOrderAndBooks()
    {
        const decimal bookVat = 0.06M;
        const decimal postageVat = 0.25M;
        var bookSum = 0.0M;
        var totalWeight = 0;
        foreach (var book in _order.books)
        {
            var dbBook = (await _books.FindAsync(b => b.Id == book.Id)).FirstOrDefault();
            if (dbBook is not null)
            {
                //make sure book in order has the correct relevant data
                book.Price = dbBook.Price;
                book.Weight = dbBook.Weight;
                //make sure we dont place an order for more books than we have in stock
                if (book.NumInstock > dbBook.NumInstock) book.NumInstock = dbBook.NumInstock;
                //subtract the number of ordered books from stock
                dbBook.NumInstock -= book.NumInstock;
                //update the book in the database
                await _books.ReplaceOneAsync(b => b.Id == book.Id, dbBook);
            }
            else
            {
                //book not found in database, remove from order
                _order.books.Remove(book);
            }
            //add the price of the book to the total price of the order
            bookSum += book.Price * book.NumInstock;
            //add the weight of the book to the total weight of the order
            totalWeight += book.Weight * book.NumInstock;
        }
        var postage = BookHelper.GetPostagePrice(totalWeight);
        _order.Postage = postage;
        _order.OrderSum = bookSum + postage;
        _order.VAT = (bookSum * bookVat) + (postage * postageVat);
    }
}
