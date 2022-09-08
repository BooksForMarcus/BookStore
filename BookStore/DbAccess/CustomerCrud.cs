
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

	public async Task<bool> UpdateCustomer(Customer updatedCustomer) 
	{
		var result = await customers.ReplaceOneAsync(x => x.Id == updatedCustomer.Id, updatedCustomer);
		
		return result.IsAcknowledged && result.ModifiedCount > 0;
	}


	//Det behöver fixa return value
	//public async Task<bool> DeleteCustomer(Customer coustomer)
	//{
	//	var result = await customers.DeleteOneAsync(s => s.Id == coustomer.Id);
	//	return ...
	//}


	

}
