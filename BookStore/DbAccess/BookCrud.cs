namespace BookStore.DbAccess;
using BookStore.Models;
using MongoDB.Driver;

public class BookCrud
{
    private IMongoCollection<Book> books;
    public BookCrud(MongoDbAccess db)
    {
        books = db.BooksCollection;
    }

    public async Task<bool> CreateBook(Book book)
    {
        if (!Helpers.Validate.TitleLongerThan3(book.Title))
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

    public async Task<bool> UpdateBookPrice(Guid id, decimal newPrice)
    {
        //var resp = await books.FindAsync(_ => true);
        //return resp.ToList();

        var updatefilter = Builders<Book>.Filter.Eq("Id", id);
        //var updatedefinition = Builders<Book>.Update.Set

        var update = Builders<Book>.Update.Set("Price", newPrice);
        var resp = await books.UpdateOneAsync(updatefilter, update);
        return resp.IsAcknowledged;

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
}