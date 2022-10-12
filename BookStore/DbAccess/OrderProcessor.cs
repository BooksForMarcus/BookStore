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

        sb.Append($@"<!DOCTYPE HTML PUBLIC ""-//W3C//DTD XHTML 1.0 Transitional//EN"" ""http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"">
<!DOCTYPE HTML PUBLIC ""-//W3C//DTD HTML 4.01 Transitional//EN"" ""http://www.w3.org/TR/html4/loose.dtd"">
<htmlxmlns:v=""urn:schemas-microsoft-com:vml""xmlns:o=""urn:schemas-microsoft-com:office:office"">
<head>
	<!--[if gte mso 9]>
		<xml>
			<o:OfficeDocumentSettings>
			<o:AllowPNG/>
			<o:PixelsPerInch>96</o:PixelsPerInch>
			</o:OfficeDocumentSettings>
		</xml>
	<![endif]-->
	<meta name=""format-detection"" content=""date=no""/>
	<meta name=""format-detection"" content=""telephone=no""/>
	<meta content=""width=device-width, initial-scale=1"" name=""viewport"" />
	<style type=""text/css""></style>
</head>
<body style=""padding:0px; margin:0px; font-family: arial,helvetica; box-sizing: border-box;"">
<h3>Hej {_order.Customer.FirstName}!</h3>
<br>
<p>Här kommer en bekräftelse på din order från Bokcirkeln:
<br>
<div style=""display: flex; place-content: center; margin: 2em; position: relative;"">
<div style=""display: grid;
	grid-template-columns: repeat(3, 2fr);
	place-items: center;
	margin: 0em 0em;
	width: 100%;
	justify-self: center;
	align-self: center;
	grid-template-areas:
	'order-number order-number order-status'
	'customer-name customer-email order-date'
	'customer-address customer-address customer-address'
	'order-items order-items order-items';"">
        <div style=""border:2px solid #ecb390;
	width: 100%;
	height: 100%;
	padding: 0em;
	font-size: larger;
	place-items: center; grid-area: order-number;"" class=""admin-order-number"">
          <h3>Order #{_order.Id}</h3>
        </div>
        <div style=""border:2px solid #ecb390;
	width: 100%;
	height: 100%;
	padding: 0em;
	font-size: larger;
	place-items: center; grid-area: order-date;"" class=""admin-order-date"">
          <p>
            Order skapad:{_order.Date.ToShortDateString()}
          </p>
        </div>
        <div style=""border:2px solid #ecb390;
	width: 100%;
	height: 100%;
	padding: 0em;
	font-size: larger;
	place-items: center;grid-area: customer-name;"" class=""admin-order-customer-name"">
          <p>
            Beställare:{_order.Customer.FirstName + " " +_order.Customer.LastName}
          </p>
        </div>
        <div style=""border:2px solid #ecb390;
	width: 100%;
	height: 100%;
	padding: 0em;
	font-size: larger;
	place-items: center; grid-area: order-status;
	display: flex;"" class=""admin-order-status"">
          <p>Status: {_order.Status}</p>
        </div>
        <div style=""border:2px solid #ecb390;
	width: 100%;
	height: 100%;
	padding: 0em;
	font-size: larger;
	place-items: center; grid-area: customer-email;"" class=""admin-order-customer-email"">
          <p>Email: {_order.Customer.Email}</p>
        </div>
        <div style=""border:2px solid #ecb390;
	width: 100%;
	height: 100%;
	padding: 0em;
	font-size: larger;
	place-items: center;grid-area: customer-address;"" class=""admin-order-customer-address"">
          <p>Adress: {_order.Customer.Address}</p>
        </div>
        <div style=""border:2px solid #ecb390;
	width: 100%;
	height: 100%;
	padding: 0em;
	font-size: larger;
	place-items: center;grid-area: order-items;
	display: grid;
	grid-template-columns: 2fr 2fr repeat(3, 1fr);"" class=""admin-order-items-container"">
          <h3 style=""grid-column: 1/6;
	justify-self: start;"">Artiklar:</h3>
          <h4 style=""color: #df7861;
	justify-self: start;"">Artikel nummer</h4>
          <h4 style=""color: #df7861;
	justify-self: start;"">Titel</h4>
          <h4 style=""color: #df7861;
	justify-self: start;"">Antal</h4>
          <h4 style=""color: #df7861;
	justify-self: start;"">á pris</h4>
          <h4 style=""color: #df7861;
	justify-self: start;"">Radsumma</h4>");
        foreach (var book in _order.books)
        {
            sb.Append($"<div style='display: grid;grid-column: 1/6;grid-template-columns: 2fr 2fr 1fr 1fr 1fr;width: 100%;border-bottom: 1px solid #ecb390;' class='admin-order-item'><p style='justify-self: start;'>{book.Id}</p><p style='justify-self: start;'>{book.Title}</p><p style='justify-self: start;'>{book.NumInstock}</p><p style='justify-self: start;'>{book.Price} kr</p><p style='justify-self: start;'>{(book.NumInstock==0?"Slut i lager":book.NumInstock*book.Price + " kr")}</p></div>");
        }
        sb.Append($@"<h4 style=""grid-column: 4;"" class=""admin-order-items-total"">Porto:</h4>
          <p style=""grid-column: 5; justify-self: start;"" class=""admin-order-items-number"">{_order.Postage} kr</p>
          <h4 style=""grid-column: 4;"" class=""admin-order-items-total"">Totalt:</h4>
          <p style=""grid-column: 5; justify-self: start;"" class=""admin-order-items-number"">{_order.OrderSum} kr</p>
          <h4 style=""grid-column: 4;"" class=""admin-order-items-vat"">Varav moms:</h4>
          <p style=""grid-column: 5; justify-self: start;"" class=""admin-order-items-number"">{_order.VAT} kr</p>
        </div>
      </div>
    </div>
    <br>
    <h3>Tack för att du handlar hos oss!</h3>
    <p>Med vänliga hälsningar,</p>
    <p>Bokcirkeln</p>
    </body>");
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
