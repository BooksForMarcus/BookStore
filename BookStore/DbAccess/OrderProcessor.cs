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
        return _order;
    }

    internal void SendMailsAsRequired(Order order)
    {
        _order = order;
        MailExternalSellers();
        MailCustomerConfirmation();
    }

    private void MailCustomerConfirmation()
    {
        if (_order.Customer.Email?.Length == 0) return;
        var mailer = new MailHelper();
        var sb = new StringBuilder();

        sb.Append($@"
            <h1>Order bekräftelse</h1>
            <p>Tack för din beställning. Ditt order nummer är {_order.Id}.</p>
            <p>Beställda artiklar:</p>
            <table style='border: 1px solid black; width: 50%'>
                <tr>
                    <th style=""width: fit-content"">Bok</th>
                    <th>Antal</th>
                    <th>á pris</th>
                    <th>Radsumma</th>
                </tr>
");
        foreach (var book in _order.books)
        {
            sb.Append(@$"<tr>
                            <td style=""text-align: center;"">{book.Title}</td>
                            <td style=""text-align: center;"">{book.NumInstock}</td>
                            <td style=""text-align: center;"">{String.Format("{0:.00}",book.Price)}</td>
                            <td style=""text-align: center;"">{String.Format("{0:.00}", (book.Price * book.NumInstock))}</td>
                        </tr>");
        }
        sb.Append(@$"
            </table>
            <p>Frakt: {_order.Postage}</p>       
            <p>Totalt: {_order.OrderSum}</p>
            <p>Varav moms: {_order.VAT}</p><br>
            <p>Fraktadress:</p>
            <p>{_order.Customer.Address}</p><br>
            <p>Tack för att du handlar hos oss!</p>
            <p>Med vänlig hälsning,</p>
            <p>Bokcirkeln</p>
");

        var mailBody = sb.ToString();
        if (!IsDev)mailer.SendMail(_order.Customer.Email, $"Orderbekräftelse {_order.Id}", mailBody);
        else
        {
            Directory.CreateDirectory("./Helpers/DevMail");
            File.WriteAllText("./Helpers/DevMail/OrderConfirmationMail.html", mailBody);
        }
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

    private void MailExternalSellers()
    {
        foreach (var seller in _order.Sellers)
        {
            var sellerBooks = _order.books.Where(b => b.SoldById == seller.Id).ToList();
            var bookStringBuilder = new StringBuilder();
            foreach (var book in sellerBooks)
            {
                if (book.NumInstock > 0)
                {
                    bookStringBuilder
                        .Append(book.NumInstock)
                        .Append(" st ")
                        .Append(book.Title)
                        .Append(" av ")
                        .Append(book.Author)
                        .Append(" - ")
                        .Append(book.Price)
                        .Append(" kr.<br>");
                }
            }
            var bookString = bookStringBuilder.ToString();
            if (!string.IsNullOrEmpty(bookString)) SendRequestDeliveryMail(seller, bookString);
        }
    }

    private void SendRequestDeliveryMail(Seller seller, string bookString)
    {
        string subject = "Ny order från Bokcirceln";
        string body = @$"<style>
html {{font-family: arial,helvetica;
}}
.mail-body {{margin: 1em;
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
        if(!IsDev) new MailHelper().SendMail(seller.Email, subject, body);
        else
        {
            Directory.CreateDirectory("./Helpers/DevMail");
            var now = DateTime.Now;
            File.WriteAllText($"./Helpers/DevMail/RequestDeliveryMail{now.Ticks}.html", body);
        }
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
