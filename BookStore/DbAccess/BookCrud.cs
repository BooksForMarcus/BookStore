namespace BookStore.DbAccess;
using BookStore.Models;
using BookStore.DTO;
using BookStore.Helpers;
using MongoDB.Driver;

public class BookCrud
{
    private IMongoCollection<Book> books;
    private IMongoCollection<Customer> customers;
    public BookCrud(MongoDbAccess db)
    {
        books = db.BooksCollection;
        customers = db.CustomersCollection;
    }

    public async Task<bool> CreateBook(Book book)
    {
        if (!Helpers.ValidateBook.TitleLongerThan3(book.Title))
        {
            return false;
        }
        await books.InsertOneAsync(book);
        var result = !String.IsNullOrWhiteSpace(book.Id);
        return result;
    }
    public async Task<List<Book>> GetAllBooks()
    {
        var resp = await books.FindAsync(_ => true);
        return resp.ToList();
    }
    public async Task<Book> GetBook(Guid Id)
    {
        var findFilter = Builders<Book>.Filter.Eq("Id", Id);
        var resp = await books.FindAsync(findFilter);
        return (Book)resp;// VS föreslog detta..? fattar inte varför behöver castas.
    }
    //public   bool  DeleteBook(Guid id)
    //{
    //    //var resp = await books.FindAsync(_ => true);
    //    //return resp.ToList();

    //    books.DeleteOne("{ Id: id}" );
    //    // returna
    //    return true;
    //}

    //public async Task<bool> DeleteBook(Guid id)
    public async Task<bool> DeleteBook(  Book book)
    {
        //var resp = await books.FindAsync(_ => true);
        //return resp.ToList();

        var deletefilter = Builders<Book>.Filter.Eq("Id", book.Id);
        var resp = await books.DeleteOneAsync(deletefilter);
        return resp.IsAcknowledged;

        //return true; //don't, actually.
    }

    public async Task<bool> UpdateBookPrice(string id, decimal newPrice)
    {
        //var resp = await books.FindAsync(_ => true);
        //return resp.ToList();

        var updatefilter = Builders<Book>.Filter.Eq("Id", id);
        //var updatedefinition = Builders<Book>.Update.Set

        var update = Builders<Book>.Update.Set("Price", newPrice);
        var resp = await books.UpdateOneAsync(updatefilter, update);
        return resp.IsAcknowledged && resp.ModifiedCount > 0;

        //return true; //don't, actually.
    }

    public async Task<bool> UpdateBookInventory(Guid id, int newNum)
    {
        //var resp = await books.FindAsync(_ => true);
        //return resp.ToList();

        var updatefilter = Builders<Book>.Filter.Eq("Id", id);
        //var updatedefinition = Builders<Book>.Update.Set

        var update = Builders<Book>.Update.Set("NumInstock", newNum);
        var resp = await books.UpdateOneAsync(updatefilter, update);
        return resp.IsAcknowledged;

        //return true; //don't, actually.
    }

    public async Task<Book> UpdateBook(Book updateBook)
    {
        var result = new Book();
        if (updateBook.Id.Length == 24)
        {
            result = await books.FindOneAndReplaceAsync(b => b.Id == updateBook.Id, updateBook);
        }
        return result;
    }
    private async Task<Customer> GetCustomerByEmail2(string mail)
    {
        var result = await customers.FindAsync(x => x.Email == mail);
        return result.FirstOrDefault();
    }

    //private  Customer  GetCustomerByEmail(string mail)
    //{
    //    var result =  customers.Find(x => x.Email == mail);
    //    return result.FirstOrDefault();
    //}

    public async Task<bool> IsAdmin(CustomerAuthorize auth)
    {
        var isAdmin = false;
        //get customer object
        var user = await GetCustomerByEmail2(auth.Email);
        if (user is not null)
        {
            //check password
            var correctPassword = CustomerHelper.ConfirmPassword(user, auth.Password);
            //check admin flag
            if (correctPassword && user.IsAdmin) isAdmin = true;
        }
        //report result
        return isAdmin;
    }
    //public bool AdminVerification(BookOperation op)
    //{
    //    string pass = op.Password;
    //    string user = op.User;

    //    var auth = new CustomerAuthorize();
    //    auth.Email = user;
    //    auth.Password = pass;
    //    //bool returnMe= await IsAdmin(auth)
    //    var isAdmin = false;
    //    var customer = GetCustomerByEmail(user);
    //    if (customer is not null)
    //    {
    //        //check password
    //        var correctPassword = CustomerHelper.ConfirmPassword(customer, pass);
    //        //check admin flag
    //    }


    //    //This method really needs to be updated with something better!
    //    return true;
    //}

    public async Task<bool> AdminVerificationAsync(BookOperation op)
    {
        string pass = op.Password;
        string user = op.User;

        var auth = new CustomerAuthorize();
        auth.Email = user;
        auth.Password = pass;
        bool returnMe = await IsAdmin(auth);
     
 


        //This method really needs to be updated with something better!
        return returnMe;
    }
}