namespace BookStore.DbAccess;

using BookStore.Helpers;
using BookStore.Models;
using BookStore.DTO;
using MongoDB.Driver;
using System.Security.AccessControl;

public class CustomerCrud
{
    private readonly IMongoCollection<Customer> customers;
    private readonly bool _isDev;

    public CustomerCrud(MongoDbAccess db)
    {
        _isDev = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development";
        customers = db.CustomersCollection;
    }

    public async Task<List<Customer>> AdminGetAllCustomers(CustomerAuthorize auth)
    {
        if (await IsAdmin(auth))
        {
            var resp = await customers.FindAsync(_ => true);
            var result = resp.ToList();

            //scrub passwords
            foreach (var customer in result)
            {
                customer.Password = "";
            }

            return result;
        }
        return new List<Customer>();
    }

    public async Task<bool> IsAdmin(CustomerAuthorize auth)
    {
        var isAdmin = false;
        //get customer object
        var user = await GetCustomerByEmail(auth.Email);
        if (user is not null)
        {
            //check password
            var correctPassword = CustomerHelper.ConfirmPassword(user, auth.Password);
            //check admin flag
            if (correctPassword && user.IsAdmin) isAdmin = true;
        }
        //report result
        return isAdmin;
    }

    public async Task<CreateCustomerResult> CreateCustomer(Customer customer)
    {
        var createResult = new CreateCustomerResult();
        //null check
        if (customer is null)
        {
            createResult.UserObjectWasNull = true;
            return createResult;
        }

        //make sure that no unwanted flags are set.
        customer.Id = "";
        customer.IsSeller = false;
        customer.IsBlocked = false;
        customer.IsAdmin = false;
        customer.IsActive = true;

        //mail ok?
        var checkMail = CustomerHelper.ValidEmail(customer.Email);
        if (!String.IsNullOrEmpty(checkMail))
        {
            customer.Email = checkMail;
            createResult.ValidMail = true;
        }

        //check if mail is already in use?
        var userWithGivenEmail = await GetCustomerByEmail(customer.Email);
        if (userWithGivenEmail is null) createResult.MailAvailable = true;

        //names ok?
        customer.FirstName = customer.FirstName.Trim();
        customer.LastName = customer.LastName.Trim();
        var firstNameOk = CustomerHelper.ValidName(customer.FirstName);
        var lastNameOk = CustomerHelper.ValidName(customer.LastName);
        if (firstNameOk) createResult.ValidFirstName = true;
        if (lastNameOk) createResult.ValidLastName = true;

        //assign random password
        var unhashedPassword = CustomerHelper.GetRandomPassword();
        customer.Password = CustomerHelper.GetHashedPassword(customer, unhashedPassword);

        //is everything is ok, try to create the user
        await customers.InsertOneAsync(customer);
        var result = !String.IsNullOrWhiteSpace(customer.Id);
        if (result) createResult.DbCreateSucceeded = true;

        //if in production, send confirmation mail to user with the password
        if (result && !_isDev)
        {
            var mailer = new MailHelper();
            mailer.SendMail(
                customer.Email,
                $"V�lkommen till Bokcirkeln {customer.FirstName}",
                $"V�lkommer till Bokcirkeln\n\nDitt tempor�ra l�senord �r: {unhashedPassword}\nKom ih�g att �ndra ditt l�sen efter f�rsta g�ngen du loggat in.\nMvh. Bokcirkeln.");
        }
        //check results
        if (createResult.DbCreateSucceeded
            && createResult.MailAvailable
            && createResult.ValidMail
            && createResult.ValidFirstName
            && createResult.ValidLastName)
        {
            createResult.Success = true;
        }
        //report result
        return createResult;
    }

    private async Task<Customer> GetCustomerByEmail(string mail)
    {
        var result = await customers.FindAsync(x => x.Email == mail);
        return result.FirstOrDefault();
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
