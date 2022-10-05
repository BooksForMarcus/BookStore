namespace BookStore.DbAccess;

using BookStore.Helpers;
using BookStore.Models;
using MongoDB.Driver;
using System;
using System.Text;
using static BookStore.Helpers.EnvironmentHelper;

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
        //if (!IsDev) await MailExternalSellers();
        await MailExternalSellers();
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

        foreach (var seller in _order.Sellers)
        {
            var sellerBooks = _order.books.Where(b => b.SoldById == seller.Id).ToList();
            var bookStringBuilder = new StringBuilder();
            foreach (var book in sellerBooks)
            {
                bookStringBuilder.Append(book.Title).Append(" - ").Append(book.Price).Append(" kr<br>");
            }
            var bookString = bookStringBuilder.ToString();
            SendMail(seller, bookString);
        }
    }

    private void SendMail(Seller seller, string bookString)
    {
        string subject = "Ny order från Bokcirceln";
        string body = @$"<style>
html {{font - family: arial,helvetica;
}}
.mail-body {{margin: 3em;
}}
</style>
<div class='mail-body'>
	<h3>Hej {seller.FirstName}!</h3>
	Du har fått en ny order på följande böcker:<br>
	{bookString}<br>
	<br>
	Kundens namn: {_order.Customer.FirstName} {_order.Customer.LastName}<br>
	Kundens epost: {_order.Customer.Email}<br>
	Kundens address: {_order.Customer.Address}<br>
	<br>
	Vänligen skicka böckerna till kunden så snart som möjligt.<br>
	<br>
	Med vänlig hälsning<br>
Bokcirkeln
</div>";
        new MailHelper().SendMail(seller.Email, subject, body);
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
