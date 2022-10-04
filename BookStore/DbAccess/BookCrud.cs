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
    private CategoryCrud cats; // for debug
    private CategoryCrud categories;

    public BookCrud(MongoDbAccess db, CustomerCrud cc, CategoryCrud cac)
    {
        books = db.BooksCollection;
        customers = cc;
        categories = cac;
    }

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

    public async Task<List<Book>> GetAllBooks()
    {
        var resp = await books.FindAsync(_ => true);
        return resp.ToList();
    }

    // VVVVVVV Används ej just nu, men kanske behövs sen..?

    public async Task<Book> GetBook(string Id)
    {
        var findFilter = Builders<Book>.Filter.Eq("Id", Id);
        var resp = await books.FindAsync(findFilter);
        return resp.FirstOrDefault();
    }

    public async Task<string> DeleteAllInCategoryTest(string Id)
    {
        var findFilter = Builders<Book>.Filter.AnyEq("Categories", Id);

        var resp = await books.FindAsync(findFilter);

        if (resp != null)
        {
            var theBooks = resp.ToList();
            var theBooks2 = theBooks.ToArray();// herrejesus...
            string returnMe = " ";
            for (int i = 0; i < theBooks2.Length; i++)
            {
                returnMe += theBooks[i].Title + "before:";
                for (int j = 0; j < theBooks[i].Categories.Length; j++)
                {
                    //returnMe += cats.GetMyCategory(theBooks[i].Categories[j]).Name;   
                    returnMe +=  theBooks[i].Categories[j]+" ";
                }
                returnMe +=    " after: ";
                var newCats = theBooks2[i].Categories.Where(x => x != Id).ToArray();
                for (int k = 0; k < newCats.Length; k++)
                {
                    //returnMe += cats.GetMyCategory(newCats[k]).Name;
                    returnMe +=  newCats[k] +" ";
                }
                //var newCats = theBooks2[i].Categories.Where(x => x != Id).ToArray();
                theBooks2[i].Categories = newCats;
                returnMe += " afterafter: ";
                for (int l = 0; l < theBooks[i].Categories.Length; l++)
                {
                    //returnMe += cats.GetMyCategory(theBooks[i].Categories[j]).Name;   
                    returnMe += theBooks[i].Categories[l]   ;
                }
                returnMe += " id:"+theBooks[i].Id+"        ";
                ////var deletefilter = Builders<Book>.Filter.Eq("Id", theBooks2[i].Id);
                ////books.ReplaceOne()
                //await books.FindOneAndReplaceAsync(b => b.Id == theBooks2[i].Id, theBooks2[i]);

            }
            return returnMe;
        }
        return "false";
    }

    //public async Task<bool> DeleteAllInCategoryDebug(string Id)
    //{
    //    var findFilter = Builders<Book>.Filter.AnyEq("Categories", Id);

    //    var resp = await books.FindAsync(findFilter);

    //    if (resp != null)
    //    {
    //        var theBooks = resp.ToList();
    //        var theBooks2 = theBooks.ToArray();// herrejesus...

    //        for (int i = 0; i < theBooks2.Length; i++)
    //        {

    //            //var newCats = theBooks2[i].Categories.Where(x => x != Id).ToArray();
    //            var newCats = theBooks2[i].Categories.Where(x => x != Id).ToArray();
    //            theBooks2[i].Categories = newCats;
    //            //var deletefilter = Builders<Book>.Filter.Eq("Id", theBooks2[i].Id);
    //            //books.ReplaceOne()
    //            //await books.FindOneAndReplaceAsync(b => b.Id == theBooks2[i].Id, theBooks2[i]);
    //            await UpdateBook(theBooks2[i]);
    //        }
    //        return true;
    //    }
    //    return false;
    //}

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

                //var newCats = theBooks2[i].Categories.Where(x => x != Id).ToArray();
                var newCats = theBooks2[i].Categories.Where(x => x != Id).ToArray();
                theBooks2[i].Categories = newCats;
                //var deletefilter = Builders<Book>.Filter.Eq("Id", theBooks2[i].Id);
                //books.ReplaceOne()
                //await books.FindOneAndReplaceAsync(b => b.Id == theBooks2[i].Id, theBooks2[i]);
                var status = await UpdateBook(theBooks2[i]);
                Console.WriteLine(status);//var är konsolen?
                if (String.IsNullOrEmpty(status)) return false;
            }
            return true;
        }
        return false;
    }

    public async Task<bool> DeleteBook(Book book)
    {
        var deletefilter = Builders<Book>.Filter.Eq("Id", book.Id);
        var resp = await books.DeleteOneAsync(deletefilter);
        return resp.IsAcknowledged;
    }

    public async Task<string> UpdateBook(Book updateBook)
    {
        if (updateBook.Id.Length == 24)     //TODO as before, more checks here?
        {
            var newBook = await books.FindOneAndReplaceAsync(b => b.Id == updateBook.Id, updateBook);
            return updateBook.Id;
        }
        return String.Empty;
    }
}