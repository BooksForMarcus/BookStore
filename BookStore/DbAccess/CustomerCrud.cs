namespace BookStore.DbAccess;

using BookStore.Models;
using MongoDB.Driver;

public class CustomerCrud
{
    private readonly IMongoCollection<Customer> customers;

    public CustomerCrud(MongoDbAccess db) =>
		customers = db.CustomersCollection;

    public async Task<List<Customer>> GetAllCustomers()
	{
		var resp = await customers.FindAsync(_ => true);
		return resp.ToList();
	}

	public async Task<bool> CreateCustomer(Customer customer)
	{
		await customers.InsertOneAsync(customer);
		var result = !String.IsNullOrWhiteSpace(customer.Id);
		return result;
	}

	public async Task<Customer> UpdateCustomer(Customer updatedCustomer)
	{
		var result = new Customer();
        if (updatedCustomer.Id.Length == 24)
        {
			result = await customers.FindOneAndReplaceAsync(x => x.Id == updatedCustomer.Id, updatedCustomer);
		}
		return result;
	}

    //Takes string Id
    public async Task<bool> DeleteCustomer(string id)
    {
        var result = false;
        if (id.Length == 24)
        {
            var response = await customers.DeleteOneAsync(x => x.Id == id);
            result = response.IsAcknowledged && response.DeletedCount > 0;
        }
        return result;
    }
}
