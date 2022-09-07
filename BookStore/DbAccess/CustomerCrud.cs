
namespace BookStore.DbAccess;

using BookStore.Models;
using MongoDB.Driver;

public class CustomerCrud
{
	private IMongoCollection<Customer> customers;
	public CustomerCrud(MongoDbAccess db)
	{
		customers = db.CustomersCollection;
	}

	public async Task<bool> CreateCustomer(Customer customer)
	{
		await customers.InsertOneAsync(customer);
		var result = !String.IsNullOrWhiteSpace(customer.Id);
		return result;
	}
	public async Task<List<Customer>> GetAllCustomers()
	{
		var resp = await customers.FindAsync(_ => true);
		return resp.ToList();
	}
}
