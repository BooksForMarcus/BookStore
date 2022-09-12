namespace BookStore.DbAccess;

using BookStore.Helpers;
using BookStore.Models;
using MongoDB.Driver;

public class CustomerCrud
{
    private readonly IMongoCollection<Customer> customers;
	private readonly bool _isDev;

	public CustomerCrud(MongoDbAccess db)
	{
        _isDev = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development";
        customers = db.CustomersCollection;
	}

    public async Task<List<Customer>> GetAllCustomers()
	{
		var resp = await customers.FindAsync(_ => true);
		return resp.ToList();
	}

	public async Task<bool> CreateCustomer(Customer customer)
	{
		//mail ok?
		var checkMail = CustomerHelper.ValidEmail(customer.Email);
		if (String.IsNullOrEmpty(checkMail)) return false;
		else customer.Email = checkMail;

		//check if mail is already in use?
		var isTaken = await IsMailTaken(customer.Email);
		if (isTaken) return false;

		//names ok?
		customer.FirstName = customer.FirstName.Trim();
        customer.LastName = customer.LastName.Trim();
        var firstNameOk = CustomerHelper.ValidName(customer.FirstName);
        var lastNameOk = CustomerHelper.ValidName(customer.LastName);
		if (!firstNameOk || !lastNameOk) return false;

		//assign random password
		var unhashedPassword = CustomerHelper.GetRandomPassword();
		customer.Password = CustomerHelper.GetHashedPassword(customer, unhashedPassword);



        //is everything is ok, try to create the user
        await customers.InsertOneAsync(customer);
		var result = !String.IsNullOrWhiteSpace(customer.Id);

		//if in production, send confirmation mail to user with the password
		if(result && !_isDev)
		{
			var mailer = new MailHelper();
			mailer.SendMail(
				customer.Email,
				$"Välkommen till Bokcirkeln {customer.FirstName}",
				$"Välkommer till Bokcirkeln\n\nDitt temporära lösenord är: {unhashedPassword}\nKom ihåg att ändra ditt lösen efter första gången du loggat in.\nMvh. Bokcirkeln.");
		}

		//report result
		return result;
	}

	private async Task<bool> IsMailTaken(string mail)
	{
		var result = await customers.FindAsync(x => x.Email == mail);
		return result.FirstOrDefault() is null ? false : true;
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
