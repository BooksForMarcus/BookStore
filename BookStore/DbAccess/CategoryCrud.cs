namespace BookStore.DbAccess;
using BookStore.Models;
using MongoDB.Driver;
public class CategoryCrud
{
    private IMongoCollection<Category> categories;
    public CategoryCrud(MongoDbAccess db)
    {
        categories = db.CategoriesCollection;

    }
    /// <summary>
    /// Does some sanity checks and then creates a category in the db
    /// </summary>
    /// <param name="category">the category</param>
    /// <returns>On success, the id of the created category, or an empty string</returns>
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
    /// <summary>
    /// Gets all categories
    /// </summary>
    /// <returns>A list of all categories</returns>
    public async Task<List<Category>> GetAllCategories()
    {
        var resp = await categories.FindAsync(_ => true);
        return resp.ToList();
    }
    /// <summary>
    /// Gets an idivudial category by its id
    /// </summary>
    /// <param name="Id">the id</param>
    /// <returns>On success a category, or null.</returns>
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
    /// <summary>
    /// Gets a category by its id synchronously.
    /// </summary>
    /// <param name="Id">the id</param>
    /// <returns>the category, or null</returns>
    public Category? GetMyCategory(string Id)
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
    /// <summary>
    /// Deletes a category
    /// </summary>
    /// <param name="category">the category to be deleted</param>
    /// <returns>true on success, or false</returns>
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
    /// <summary>
    /// Updates a category.
    /// </summary>
    /// <param name="updateCategory">The new version of the category to be updated</param>
    /// <returns>O n success the id of the updated  category, or an empty string</returns>
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


