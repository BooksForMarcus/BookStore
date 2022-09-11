namespace BookStore.Helpers;

using BookStore.Models;
using Microsoft.AspNetCore.Identity;
using System.Net.Mail;
using System.Text;
using System.Text.RegularExpressions;

public static class CustomerHelper
{
    /// <summary>
    /// Function for making sure the given info follows a valid email structure.
    /// </summary>
    /// <param name="email">The email address.</param>
    /// <returns>An empty string if the address is invalid, else the address(cleaned up).</returns>
    public static string ValidEmail(string email)
    {
        if (string.IsNullOrEmpty(email)) return "";
        var isValid = MailAddress.TryCreate(email, out MailAddress address);
        return isValid ? address!.Address : String.Empty;
    }
    /// <summary>
    /// Function for rudimentary control of names, makes sure names start with
    /// a letter, is between 2 and 35 chars long and contains only letters, ', spaces or -.
    /// </summary>
    /// <param name="name">The name.</param>
    /// <returns>True if name matches the given rules.</returns>
    public static bool ValidName(string name)
    {
        if (string.IsNullOrEmpty(name)) return false;

        var regex = new Regex(@"^[\u00c0-\u01ffa-zA-Z](?:[ \u00c0-\u01ffa-zA-Z'\-]){2,35}$");
        return regex.IsMatch(name);
    }

    /// <summary>
    /// Gets a hash for the given password.
    /// </summary>
    /// <param name="customer">The customer.</param>
    /// <param name="pass">The password to hash.</param>
    /// <returns>The hash of the password.</returns>
    public static string GetHashedPassword(Customer customer, string pass)
    {
        if (customer is null || pass is null) return string.Empty;

        var hasher = new PasswordHasher<Customer>();
        return hasher.HashPassword(customer, pass);
    }
    /// <summary>
    /// Function to verify that a clear text password when hashed matches the hash saved in the <see cref="Customer"/> object.
    /// </summary>
    /// <param name="customer">The customer.</param>
    /// <param name="password">The password.</param>
    /// <returns><see langword="true"/> if the given password matches the saved one.</returns>
    public static bool ValidatePassword(Customer customer, string password)
    {
        if (customer is null || password is null) return false;

        var hasher = new PasswordHasher<Customer>();
        var result = hasher.VerifyHashedPassword(customer, customer.Password, password);
        return result.HasFlag(PasswordVerificationResult.Success);
    }

    /// <summary>
    /// Gets a random 10 character length password.
    /// </summary>
    /// <returns>The generated <see langword="string"/> containing the password.</returns>
    public static string GetRandomPassword()
    {
        const int passwordLength = 10;
        const string characters = "ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijklmnpqrstuvwxyz123456789";
        var rng = new Random();
        var temp = new StringBuilder();

        for (int i = 0; i < passwordLength; i++)
        {
            temp.Append(characters[rng.Next(characters.Length)]);
        }

        return temp.ToString();
    }
}
