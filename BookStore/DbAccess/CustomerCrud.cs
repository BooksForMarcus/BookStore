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

    /// <summary>
    /// Given a admin email a password will return a list containing all users.
    /// </summary>
    /// <param name="auth"><see cref="CustomerAuthorize"/> object containing the admin email and password.</param>
    /// <returns>A <see cref="List{T}"/> where T is <see cref="Customer"/> containing a the customers in the database.</returns>
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
        //to simplify during dev, pass along the unhashed password
        if (_isDev) createResult.DevPass = unhashedPassword;

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
                $"Välkommen till Bokcirkeln {customer.FirstName}",
                $"Välkommer till Bokcirkeln!<br><br>Ditt temporära lösenord är: {unhashedPassword}<br>Kom ihåg att ändra ditt lösen efter första gången du loggat in.<br><br>Mvh. Bokcirkeln.");
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

    public async Task<Customer> UpdateCustomer(CustomerOperation op)
    {
        if (op is null || op.CustomerToUpdate is null) return null!;
        var shouldUpdate = false;
        Customer updateCustomer = null!;
        var auth = new CustomerAuthorize() { Email = op.Email, Password = op.Password };


        //is it admin trying to change a user/itself?
        if (await IsAdmin(auth))
        {
            var orginal = await GetCustomerByEmail(op.CustomerToUpdate.Email);
            updateCustomer = op.CustomerToUpdate;
            updateCustomer.Id = orginal.Id;
            if (!String.IsNullOrWhiteSpace(updateCustomer.Password))
            {
                updateCustomer.Password =
                    CustomerHelper.GetHashedPassword(
                        updateCustomer,
                        updateCustomer.Password
                        );
            }
            else
            {
                updateCustomer.Password = orginal.Password;
            }
            shouldUpdate = true;
        }
        //is it user trying to change its own info?
        else if (op.Email == op.CustomerToUpdate.Email)
        {
            if (await AuthorizeCustomer(auth))
            {
                updateCustomer = await GetCustomerByEmail(op.Email);
                //use may change name(First,Last),password and address
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
                shouldUpdate = true;
            }
        }


        if (updateCustomer.Id.Length == 24 && shouldUpdate)
        {
            updateCustomer = await customers.FindOneAndReplaceAsync(x => x.Id == updateCustomer.Id, updateCustomer);
        }
        return updateCustomer;
    }

    private async Task<bool> AuthorizeCustomer(CustomerAuthorize auth)
    {
        var loginOk = false;
        //get customer object
        var user = await GetCustomerByEmail(auth.Email);
        if (user is not null)
        {
            //check password
            var correctPassword = CustomerHelper.ConfirmPassword(user, auth.Password);

            if (correctPassword) loginOk = true;
        }
        //report result
        return loginOk;
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

    public async Task<Customer> Login(CustomerAuthorize auth)
    {
        Customer result = null!;
        if (auth is not null && !String.IsNullOrEmpty(auth.Email) && !String.IsNullOrWhiteSpace(auth.Password))
        {
            var cust = await GetCustomerByEmail(auth.Email);
            if (cust is not null)
            {
                var correctPassword = CustomerHelper.ConfirmPassword(cust, auth.Password);
                if (correctPassword)
                {
                    result = cust;
                    //scrub password
                    result.Password = "";
                }
            }
        }
        return result;
    }
}
