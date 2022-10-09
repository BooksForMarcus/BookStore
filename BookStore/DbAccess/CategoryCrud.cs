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

    public async Task<string> CreateCategory(Category category)
    {
        category.Id = String.Empty;

        var findFilter = Builders<Category>.Filter.Eq("Name", category.Name);
        var sameName = await categories.FindAsync(findFilter);
        var sameNameList = await sameName.ToListAsync();
        int sameNameCount = sameNameList.Count;

        if (sameNameCount == 0)
        {
            await categories.InsertOneAsync(category);
        }
        return category.Id;
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
            var resp = categories.Find(findFilter);

            return resp.FirstOrDefault();
        }
    }
    public Category? GetMyCategory(string Id)
    {
        //TODO: kolla så att id är 24d hex, inte bara length 24?
        // annars failar  med error 500 i nästa steg om 24char, men inte ett hextal?

        if (Id.Length != 24)
        {
            return null;
        }
        else
        {
            var findFilter = Builders<Category>.Filter.Eq("Id", Id);

            var resp = categories.Find(findFilter);

            return resp.FirstOrDefault();
        }
    }
    public async Task<bool> DeleteCategory(Category category)
    {

        if (category.Id.Length == 24)
        {
            var deletefilter = Builders<Category>.Filter.Eq("Id", category.Id);
            var resp = await categories.DeleteOneAsync(deletefilter);
            return resp.IsAcknowledged;
        }
        return false;
    }

    public async Task<string> UpdateCategory(Category updateCategory)
    {
        var findFilter = Builders<Category>.Filter.Eq("Name", updateCategory.Name);
        var sameName = await categories.FindAsync(findFilter);
        var sameNameList = await sameName.ToListAsync();
        int sameNameCount = sameNameList.Count;

        if (sameNameCount == 0)
        {
            if (updateCategory.Id.Length == 24)
            {
                var newCategory = await categories.FindOneAndReplaceAsync(b => b.Id == updateCategory.Id, updateCategory);
                return updateCategory.Id;
            }
        }
        return String.Empty;
    }
}


