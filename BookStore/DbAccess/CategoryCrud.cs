namespace BookStore.DbAccess;
using BookStore.Models;
using MongoDB.Driver;

using BookStore.DTO;
using BookStore.Helpers;
using MongoDB.Bson;


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
        //Guid guidOutput; // skräpvariabel, gör ingenting...
        //if (!Guid.TryParse(category.Id, out guidOutput))
        //{
        //    category.Id = Guid.NewGuid().ToString("N");
        //}

        ObjectId id = ObjectId.GenerateNewId();
        category.Id = id.ToString();

        var findFilter = Builders<Category>.Filter.Eq("Name", category.Name);
        var sameName = await categories.FindAsync(findFilter);
        var sameNameList = await sameName.ToListAsync();
        int sameNameCount = sameNameList.Count;

        if (sameNameCount == 0)
        {
            await categories.InsertOneAsync(category);
        }
        var findFilter3 = Builders<Category>.Filter.Eq("Id", category.Id);

        var result = await categories.Find(findFilter3).ToListAsync();
        var myResult = result.FirstOrDefault();
        var categoryFound = (myResult != null);
        return categoryFound;
        //var result = !String.IsNullOrWhiteSpace(category.Id);
        return true;
    }
    public async Task<List<Category>> GetAllCategories()
    {
        var resp = await categories.FindAsync(_ => true);
        return resp.ToList();
    }
    public async Task<Category?> GetCategory(string Id)
    {
        if (Id.Length != 24)
        {
            return null;
        }
        else
        {
            var findFilter = Builders<Category>.Filter.Eq("Id", Id);
            ////var findFilter = Builders<Category?>.Filter.Eq("Id", Id.ToString());
            var resp = categories.Find(findFilter);

            return resp.FirstOrDefault();
        }

        //var findFilter = Builders<Category?>.Filter.Eq("Id", Id.ToString());
        ////var findFilter = Builders<Category?>.Filter.Eq("Id", Id.ToString());
        //var resp = categories.Find(findFilter);
        //return resp.FirstOrDefault();
    }
    public Category? GetMyCategory (string Id)
    {
        //var resp = categories.Find(_ => true);

        //if (Id.Length != 24 || ! int.TryParse(Id, out int dummy)) //TODO: kolla så att id är 24d hex?
        if (Id.Length != 24 )                                       // annars failar  med error 500 i nästa steg om 24char, men inte ett hextal?
        {
            return null;
        }
        else
        {
            var findFilter = Builders<Category>.Filter.Eq("Id", Id);
            ////var findFilter = Builders<Category?>.Filter.Eq("Id", Id.ToString());
            var resp = categories.Find(findFilter);

            return resp.FirstOrDefault();
        }
    }
    public async Task<bool> DeleteCategory(Category category)
    {
        var deletefilter = Builders<Category>.Filter.Eq("Id", category.Id);
        var resp = await categories.DeleteOneAsync(deletefilter);
        return resp.IsAcknowledged;
    }

}


