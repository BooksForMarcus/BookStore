namespace BookStore.DbAccess;
using BookStore.Models;
using BookStore.DTO;
using BookStore.Helpers;
using MongoDB.Driver;
using MongoDB.Bson;
using System.Linq;

public class BookCrud
{
    private IMongoCollection<Book> books;
    private CustomerCrud customers;
    private CategoryCrud categories;

    public BookCrud(MongoDbAccess db, CustomerCrud cc, CategoryCrud cac)
    {
        books = db.BooksCollection;
        customers = cc;
        categories = cac;
    }

    public async Task<bool> CreateBook(Book book)
    {
        //Guid guidOutput; // skräpvariabel, gör ingenting...
        //if (!Guid.TryParse(book.Id, out guidOutput))
        //{
        //    book.Id = Guid.NewGuid().ToString("N");
        //}

        ObjectId id = ObjectId.GenerateNewId();
        book.Id = id.ToString();

        // filter för dubletter med samma isbn & säljare

        var findFilter = Builders<Book>.Filter.Eq("SoldBy", book.SoldBy);
        var findFilter2 = Builders<Book>.Filter.Eq("ISBN", book.ISBN);
        findFilter &= findFilter2;

        var sameBookSameSeller = await books.FindAsync(findFilter);
        var sameBookSameSellerList = await sameBookSameSeller.ToListAsync();
        int sameBookCount = sameBookSameSellerList.Count;

        //!string.IsNullOrWhiteSpace(newBook.Id));
        // ta bort dubletter i kategorilistan
        book.Categories = book.Categories.Distinct().ToArray();
        //Ta bort referenser till kategorier som inte finns

        book.Categories = book.Categories.Where(x => (categories.GetMyCategory(x)) != null).ToArray();


        //book.Categories = book.Categories.Where(x => (categories.GetCategory(x)) != null).ToArray();




        //Console.WriteLine("sameBookCount ", sameBookCount);
        if (sameBookCount == 0)
        {

            await books.InsertOneAsync(book);
        }
        var result = !String.IsNullOrWhiteSpace(book.Id);
        //var findFilter3 = Builders<Book>.Filter.Eq("Id", book.Id);

        //var result = await books.Find(findFilter3).ToListAsync();
        //var myResult = result.FirstOrDefault();
        //var bookFound = (myResult != null);
        //return bookFound;
        return result;
        return true;
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
        return resp.FirstOrDefault();
    }
 
    public async Task<bool> DeleteBook(  Book book)
    {
        //var resp = await books.FindAsync(_ => true);
        //return resp.ToList();

        var deletefilter = Builders<Book>.Filter.Eq("Id", book.Id);
        var resp = await books.DeleteOneAsync(deletefilter);
        return resp.IsAcknowledged;

        //return true; //don't, actually.
    }

 

    public async Task<bool> UpdateBook(Book updateBook)
    {
        //var result = new Book();
        var result = true;

        if (updateBook.Id.Length == 24)
        //if (updateBook.Id.Length == 32)

        {

            var newBook = await books.FindOneAndReplaceAsync(b => b.Id == updateBook.Id, updateBook);
            result = (newBook != null && !string.IsNullOrWhiteSpace(newBook.Id));
        }
        return result;
    }
 
}