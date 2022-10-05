namespace BookStore.DbAccess;

using BookStore.Helpers;
using BookStore.Models;
using BookStore.DTO;
using MongoDB.Driver;
using static Helpers.EnvironmentHelper;

public class CustomerCrud
{
    private readonly IMongoCollection<Customer> customers;
    private readonly bool _isDev;

    public CustomerCrud(MongoDbAccess db)
    {
        _isDev = IsDev;
        customers = db.CustomersCollection;
    }

    public async Task<List<Customer>> AdminGetAllCustomers()
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

    /// <summary>
    /// Determines whether the specified authentication is admin.
    /// </summary>
    /// <param name="auth">The authentication object containing login email and password.</param>
    /// <returns>
    ///   <see langword="true"/> if the specified authentication is admin; otherwise, <see langword="false"/>.
    /// </returns>
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

        //we dont want emails to be cap sensitive.
        customer.Email = customer.Email.ToLower();
        //mail ok?
        var checkMail = CustomerHelper.ValidEmail(customer.Email);
        if (!String.IsNullOrEmpty(checkMail))
        {
            customer.Email = checkMail;
            createResult.ValidMail = true;
        }

        //check if mail is already in use?
        var userWithGivenEmail = await GetCustomerByEmail(customer.Email);
        if (userWithGivenEmail is null || !userWithGivenEmail.IsActive) createResult.MailAvailable = true;

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
        //to simplify during dev, pass along the unhashed password
        if (_isDev) createResult.DevPass = unhashedPassword;

        //is everything is ok, try to create the user
        if (createResult.MailAvailable
            && createResult.ValidMail
            && createResult.ValidFirstName
            && createResult.ValidLastName)
        {
            var result = false;
            if (userWithGivenEmail is not null)
            {
                //if the user already exists, but is not active, we can reactivate it.
                var filter = Builders<Customer>.Filter.Eq(c => c.Email, customer.Email);
                var updateIsActive = Builders<Customer>.Update.Set("IsActive", true);
                var updateFirstName = Builders<Customer>.Update.Set("FirstName", customer.FirstName);
                var updateLastName = Builders<Customer>.Update.Set("LastName", customer.LastName);
                var updatePassword = Builders<Customer>.Update.Set("Password", customer.Password);
                var updateAddress = Builders<Customer>.Update.Set("Address", customer.Address);
                var update = Builders<Customer>.Update.Combine(updateIsActive, updateFirstName, updateLastName, updatePassword, updateAddress);

                var resp = await customers.UpdateOneAsync(filter, update);
                result = resp.IsAcknowledged && resp.ModifiedCount == 1;
            }
            else
            {
                //if the user does not exist, we can create a new one
                await customers.InsertOneAsync(customer);
                result = !String.IsNullOrWhiteSpace(customer.Id);

            }
            if (result) createResult.DbCreateSucceeded = true;
        }

        //if in production, send confirmation mail to user with the password
        if (createResult.DbCreateSucceeded && !_isDev)
        {
            var mailer = new MailHelper();
            mailer.SendMail(
                customer.Email,
                $"Välkommen till Bokcirkeln {customer.FirstName}",
                $"Välkommen till Bokcirkeln!<br><br>Ditt temporära lösenord är: {unhashedPassword}<br>Kom ihåg att ändra ditt lösen efter första gången du loggat in.<br><br>Mvh. Bokcirkeln.");
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

    public async Task<bool> DeleteCustomer(CustomerOperation op)
    {
        var result = false;
        if (op is null
           || string.IsNullOrWhiteSpace(op.Id)
           || op.CustomerToUpdate is null
           || string.IsNullOrWhiteSpace(op.CustomerToUpdate.Id)) return result;

        var customerToDelete = new Customer();
        if (op.CustomerToUpdate.Id.Length == 24)
        {
            customerToDelete = await GetCustomerById(op.CustomerToUpdate.Id);
            if (op.IsAdmin && op.Id != op.CustomerToUpdate.Id && customerToDelete is not null)
            {
                var response = await customers.DeleteOneAsync(x => x.Id == op.CustomerToUpdate.Id);
                result = response.IsAcknowledged && response.DeletedCount > 0;
            }
            else if (op.Id == op.CustomerToUpdate.Id && customerToDelete is not null)
            {
                var updatefilter = Builders<Customer>.Filter.Eq("Id", op.CustomerToUpdate.Id);

                var update = Builders<Customer>.Update.Set("IsActive", false);
                var resp = await customers.UpdateOneAsync(updatefilter, update);
                result = resp.IsAcknowledged && resp.ModifiedCount > 0;
            }
        }
        if (result && !IsDev) CustomerHelper.SendGoodByeMail(customerToDelete!);
        return result;
    }

    private async Task<Customer> GetCustomerById(string id)
    {
        var result = await customers.FindAsync(c => c.Id == id);
        return result.FirstOrDefault();
    }

    public async Task<LoginResponse> Login(CustomerAuthorize auth)
    {
        LoginResponse result = new();
        if (auth is not null && !String.IsNullOrEmpty(auth.Email) && !String.IsNullOrWhiteSpace(auth.Password))
        {
            //we dont wan't mails to be cap sensitive
            auth.Email = auth.Email.ToLower();
            var cust = await GetCustomerByEmail(auth.Email);
            if (cust is not null && cust.IsActive)
            {
                result.UserFound = true;
                result.ValidPassword = CustomerHelper.ConfirmPassword(cust, auth.Password);
            }
            if (result.ValidPassword) result.IsBlocked = cust!.IsBlocked;
            if (result.ValidPassword && !result.IsBlocked)
            {
                result.Success = true;
                //scrub password
                cust.Password = "";
                result.User = cust;
            }
        }
        return result;
    }

    public async Task<Customer?> AdminUpdateCustomer(CustomerOperation op)
    {
        Customer result = null!;
        if (op is null
            || op.CustomerToUpdate is null
            || !op.IsAdmin) return result;

        //if the password field is not empty in customerToUpdate, we encrypt it and add it back.
        if (!string.IsNullOrWhiteSpace(op.CustomerToUpdate.Password))
        {
            var newPassHash = CustomerHelper.GetHashedPassword(op.CustomerToUpdate, op.CustomerToUpdate.Password);
            op.CustomerToUpdate.Password = newPassHash;
        }
        //if the password field is actually emtpy, we need to get the hash from the db
        else
        {
            var old = await GetCustomerById(op.CustomerToUpdate.Id);
            op.CustomerToUpdate.Password = old.Password;
        }
        result = await customers.FindOneAndReplaceAsync(x => x.Id == op.CustomerToUpdate.Id, op.CustomerToUpdate);
        //scrub!
        result.Password = "";
        return result;
    }

    internal async Task<Customer?> CustomerUpdateSelf(CustomerOperation op)
    {
        var updateCustomer = await GetCustomerById(op.Id);
        if (updateCustomer is not null)
        {
            //user may change name(First,Last),password and address
            if (!String.IsNullOrWhiteSpace(op.CustomerToUpdate.FirstName))
                updateCustomer.FirstName = op.CustomerToUpdate.FirstName;
            if (!String.IsNullOrWhiteSpace(op.CustomerToUpdate.LastName))
                updateCustomer.LastName = op.CustomerToUpdate.LastName;
            if (!String.IsNullOrWhiteSpace(op.CustomerToUpdate.Address))
                updateCustomer.Address = op.CustomerToUpdate.Address;
            if (!String.IsNullOrWhiteSpace(op.CustomerToUpdate.Password))
            {
                updateCustomer.Password = CustomerHelper.GetHashedPassword(op.CustomerToUpdate, op.CustomerToUpdate.Password);
            }
            if (updateCustomer.Id.Length == 24)
            {
                updateCustomer = await customers.FindOneAndReplaceAsync(x => x.Id == updateCustomer.Id, updateCustomer);
            }
            //scrub password before returning.
            updateCustomer.Password = "";
        }
        return updateCustomer;
    }

    public async Task<bool> PasswordReset(Customer forgetful)
    {

        var result = false;
        if (!string.IsNullOrWhiteSpace(forgetful.Email) &&
            !string.IsNullOrEmpty(CustomerHelper.ValidEmail(forgetful.Email)))
        {
            var customer = await GetCustomerByEmail(forgetful.Email);
            if (customer is not null)
            {
                var mailer = new MailHelper();
                var newPass = CustomerHelper.GetRandomPassword();
                var newPassHash = CustomerHelper.GetHashedPassword(customer, newPass);
                var updatefilter = Builders<Customer>.Filter.Eq("Id", customer.Id);
                var update = Builders<Customer>.Update.Set("Password", newPassHash);
                var resp = await customers.UpdateOneAsync(updatefilter, update);
                result = resp.IsAcknowledged && resp.ModifiedCount > 0;
                if (result)
                {
                    if (EnvironmentHelper.IsDev)
                    {
                        forgetful.Password = newPass;
                    }
                    else
                    {
                        mailer.SendMail(
                            customer.Email,
                            $"Ditt nya lösenord till Bokcirkeln",
                            $"Hej {customer.FirstName}!<br><br>Ditt nya lösenord är: {newPass}<br><br>Mvh. Bokcirkeln.");
                    }
                }
            }
        }
        return result;
    }
}
