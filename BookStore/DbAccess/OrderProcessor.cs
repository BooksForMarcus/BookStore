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

        sb.Append($@"<style type=""text/css"">
* {{
	font-family: arial,helvetica;
	box-sizing: border-box;
}}
.mail-body {{
	margin: 1em;
}}
.admin-order-show-container {{
	display: flex;
	place-content: center;
	margin: 2em;
	position: relative;
}}
.admin-order-show {{
	display: grid;
	grid-template-columns: repeat(3, 2fr);
	place-items: center;
	margin: 0em 0em;
	width: 100%;
	justify-self: center;
	align-self: center;
	grid-template-areas:
	""order-number order-number order-status""
	""customer-name customer-email order-date""
	""customer-address customer-address customer-address""
	""order-items order-items order-items"";
}}
.admin-order-show>div {{
	border:2px solid #ecb390;
	width: 100%;
	height: 100%;
	padding: 0.5em;
	font-size: larger;
	place-items: center;
}}
.admin-order-show>h1 {{
	grid-area: order-number;
	margin: 0em;
}}
.admin-order-number {{
	grid-area: order-number;
}}
.admin-order-number>h1{{
	margin: 0;
}}
.admin-order-date {{
	grid-area: order-date;
}}
.admin-order-status {{
	grid-area: order-status;
	display: flex;
}}
.admin-order-customer-name {{
	grid-area: customer-name;
}}
.admin-order-customer-email {{
	grid-area: customer-email;
}}
.admin-order-customer-address{{
	grid-area: customer-address;
}}
.admin-order-items-container  {{
	grid-area: order-items;
	display: grid;
	grid-template-columns: 2fr 2fr repeat(3, 1fr);
	
}}
.admin-order-items-container>h3 {{
	grid-column: 1/6;
	justify-self: start;
}}
.admin-order-items-container>h4 {{
	color: #df7861;
	justify-self: start;
}}
.admin-order-item {{
	display: grid;
	grid-column: 1/6;
	grid-template-columns: 2fr 2fr 1fr 1fr 1fr;
	width: 100%;
	border-bottom: 1px solid #ecb390;
}}
.admin-order-item>p {{
justify-self: start;
}}
.admin-order-items-total {{
	grid-column: 4;
}}
.admin-order-items-number {{
	grid-column: 5;
	justify-self: start;
}}
.admin-order-items-vat {{
	grid-column: 4;
}}
</style>
<div class=""mail-body"">
<h3>Hej {_order.Customer.FirstName}!</h3>
<br>
<p>Här kommer en bekräftelse på din order från Bokcirkeln:
<br>
<div class=""admin-order-show-container"">
<div class=""admin-order-show"" >
        <div class=""admin-order-number"">
          <h3>Order #{_order.Id}</h3>
        </div>
        <div class=""admin-order-date"">
          <p>
            Order skapad:{_order.Date.ToShortDateString()}
          </p>
        </div>
        <div class=""admin-order-customer-name"">
          <p>
            Beställare:{_order.Customer.FirstName + " " +_order.Customer.LastName}
          </p>
        </div>
        <div class=""admin-order-status"">
          <p>Status: {_order.Status}</p>
        </div>
        <div class=""admin-order-customer-email"">
          <p>Email: {_order.Customer.Email}</p>
        </div>
        <div class=""admin-order-customer-address"">
          <p>Adress: {_order.Customer.Address}</p>
        </div>
        <div class=""admin-order-items-container"">
          <h3>Artiklar:</h3>
          <h4>Artikel nummer</h4>
          <h4>Titel</h4>
          <h4>Antal</h4>
          <h4>á pris</h4>
          <h4>Radsumma</h4>");
        foreach (var book in _order.books)
        {
            sb.Append($"<div class=\"admin-order-item\"><p>{book.Id}</p><p>{book.Title}</p><p>{book.NumInstock}</p><p>{book.Price} kr</p><p>{(book.NumInstock==0?"Slut i lager":book.NumInstock*book.Price + " kr")}</p></div>");
        }
        sb.Append($@"<h4 class=""admin-order-items-total"">Porto:</h4>
          <p class=""admin-order-items-number"">{_order.Postage} kr</p>
          <h4 class=""admin-order-items-total"">Totalt:</h4>
          <p class=""admin-order-items-number"">{_order.OrderSum} kr</p>
          <h4 class=""admin-order-items-vat"">Varav moms:</h4>
          <p class=""admin-order-items-number"">{_order.VAT} kr</p>
        </div>
      </div>
    </div>
    <br>
    <h3>Tack för att du handlar hos oss!</h3>
    <p>Med vänliga hälsningar,</p>
    <p>Bokcirkeln</p>
    </div>");
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
