namespace BookStore.DbAccess;
using BookStore.Models;
using BookStore.DTO;
using BookStore.Helpers;
using MongoDB.Driver;
using MongoDB.Bson;
using System.Linq;

public class BookCrud
{
    private readonly IMongoCollection<Book> books;
    private readonly CategoryCrud categories;
    /// <summary>
    /// The constructor takes 
    /// </summary>
    /// <param name="db"></param>
    /// <param name="cac"></param>
    public BookCrud(MongoDbAccess db, CategoryCrud cac)
    {
        books = db.BooksCollection;
        categories = cac;
    }
    /// <summary>
    /// Does some sanity checks and then creates a book in the db. 
    /// </summary>
    /// <param name="book">The Book object to be inserted</param>
    /// <returns>On success, the id string of the created book</returns>
    public async Task<string> CreateBook(Book book)
    {
        // Ignorera skräpdata från swagger

        book.Id = String.Empty;

        // filter för dubletter med samma isbn & säljare

        var findFilter = Builders<Book>.Filter.Eq("SoldById", book.SoldById);
        var findFilter2 = Builders<Book>.Filter.Eq("ISBN", book.ISBN);
        findFilter &= findFilter2;

        var sameBookSameSeller = await books.FindAsync(findFilter);
        var sameBookSameSellerList = await sameBookSameSeller.ToListAsync();
        int sameBookCount = sameBookSameSellerList.Count;

        // ta bort dubletter i kategorilistan

        book.Categories = book.Categories.Distinct().ToArray();

        //Ta bort referenser till kategorier som inte finns

        book.Categories = book.Categories.Where(x => (categories.GetMyCategory(x)) != null).ToArray();

        if (sameBookCount == 0)
        {
            await books.InsertOneAsync(book);
        }
        var result = !String.IsNullOrWhiteSpace(book.Id);

        return book.Id;
    }
    /// <summary>
    /// Gets a list of all books.
    /// </summary>
    /// <returns>A list of Book objects</returns>
    public async Task<List<Book>> GetAllBooks()
    {
        var resp = await books.FindAsync(_ => true);
        return resp.ToList();
    }
    /// <summary>
    /// Gets an individual book by its id
    /// </summary>
    /// <param name="Id">the id in string format</param>
    /// <returns>A  book</returns>
    public async Task<Book> GetBook(string Id)
    {
        var findFilter = Builders<Book>.Filter.Eq("Id", Id);
        var resp = await books.FindAsync(findFilter);
        return resp.FirstOrDefault();
    }
/// <summary>
/// Deletes the id of a (to be deleted) category in the book.categories array
/// </summary>
/// <param name="Id">the id of the category</param>
/// <returns>true on success, or false.</returns>
    public async Task<bool> DeleteAllRefsToCategory(string Id)
    {
        var findFilter = Builders<Book>.Filter.AnyEq("Categories", Id);

        var resp = await books.FindAsync(findFilter);

        if (resp != null)
        {
            var theBooks = resp.ToList();
            var theBooks2 = theBooks.ToArray();// herrejesus...

            for (int i = 0; i < theBooks2.Length; i++)
            {
                var newCats = theBooks2[i].Categories.Where(x => x != Id).ToArray();
                theBooks2[i].Categories = newCats;
                var status = await UpdateBook(theBooks2[i]);
                if (String.IsNullOrEmpty(status)) return false;
            }
            return true;
        }
        return false;
    }
    /// <summary>
    /// Deletes A Book.
    /// </summary>
    /// <param name="book">The book</param>
    /// <returns>true on success, or false.</returns>
    public async Task<bool> DeleteBook(Book book)
    {
        var deletefilter = Builders<Book>.Filter.Eq("Id", book.Id);
        var resp = await books.DeleteOneAsync(deletefilter);
        return resp.IsAcknowledged;
    }
    /// <summary>
    /// Updates a book.
    /// </summary>
    /// <param name="updateBook">the book</param>
    /// <returns>On success id of updatedbook, or an empty string</returns>
    public async Task<string> UpdateBook(Book updateBook)
    {
        if (updateBook.Id.Length == 24)     
        {
            var newBook = await books.FindOneAndReplaceAsync(b => b.Id == updateBook.Id, updateBook);
            return updateBook.Id;
        }
        return String.Empty;
    }
}