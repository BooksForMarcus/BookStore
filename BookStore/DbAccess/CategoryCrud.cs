namespace BookStore.DbAccess;
using BookStore.Models;
using MongoDB.Driver;

using BookStore.DTO;
using BookStore.Helpers;



public class CategoryCrud
{
    private IMongoCollection<Category> categories;
    public CategoryCrud(MongoDbAccess db)
    {
        categories = db.CategoriesCollection;

    }
    //public BookCrud(MongoDbAccess db)
    //{
    //    books = db.BooksCollection;
    //    customers = db.CustomersCollection;
    //}
    public async Task<bool> CreateCategory(Category category)
    {
        if (category.Parent!=null)
        {
            category.Name = category.Parent.Name+"."+category.Name;
        }
        await categories.InsertOneAsync(category);
        var result = !String.IsNullOrWhiteSpace(category.Id);
        return result;
    }
    public async Task<List<Category>> GetAllCategories()
    {
        var resp = await categories.FindAsync(_ => true);
        return resp.ToList();
    }
    public async Task<Category> GetCategory(Guid Id)
    {
        var findFilter = Builders<Category>.Filter.Eq("Id", Id);
        var resp = await categories.FindAsync(findFilter);
        return resp.FirstOrDefault();
    }

    //public async Task<Book> GetBookByName(string Name)
    //{
    //    var findFilter = Builders<Category>.Filter.Eq("Name", Name);
    //    var resp = await categories.FindAsync(findFilter);
    //    return (Category)resp; 
    //}

    public async Task<List<Category>> GetCategoriesByParent(Category category)
    {

        var resp0 = await categories.FindAsync(_ => true);
        var findFilter = Builders<Category>.Filter.Eq("Parent", category);

        var resp = await categories.FindAsync(findFilter);

        return resp.ToList();
    }








    public async Task<bool> DeleteCategory(Category category)
    {
        //var resp = await books.FindAsync(_ => true);
        //return resp.ToList();

        var deletefilter = Builders<Category>.Filter.Eq("Id", category.Id);
        var resp = await categories.DeleteOneAsync(deletefilter);
        return resp.IsAcknowledged;

        //return true; //don't, actually.
    }







    //public bool AdminVerification(BookOperation op)
    public bool AdminVerification()
    {


        //if (op.User=="Admin" && op.Pass)

        //This method really needs to be updated with something better!
        return true;
    }

}


