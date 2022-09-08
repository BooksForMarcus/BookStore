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
		if (id.Length == 24)
		{
			await customers.DeleteOneAsync(x => x.Id == id);
			return true;
		}
		return false;
	}

	//Takes Customer object, then customer ID
	//public async Task<bool> DeleteCustomer(Customer customer)
	//{

	//	if (customer.Id.Length == 24)
	//	{
	//		await customers.DeleteOneAsync(x => x.Id == customer.Id);
	//		return true;
	//	}
	//	return false;
	//}
}
