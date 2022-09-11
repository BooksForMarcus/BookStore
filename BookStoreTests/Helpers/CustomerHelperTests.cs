using Xunit;
using static BookStore.Helpers.CustomerHelper;
using BookStore.Models;

namespace BookStore.Helpers.Tests;

public class CustomerHelperTests
{
    [Theory()]
    [InlineData("hej@hej.se", "hej@hej.se")]
    [InlineData("hej       @hej.se", "hej@hej.se")]
    [InlineData("       hej@hej.se", "hej@hej.se")]
    [InlineData("hej@@hej.se", "")]
    public void ValidEmailTest(string email,string expected)
    {
        var result = ValidEmail(email);
        Assert.Equal(expected, result);
    }
    [Theory()]
    [InlineData("Thomas Thorin", true)]
    [InlineData("Thoma5 Thorin", false)]
    [InlineData("ThomasThorin", true)]
    [InlineData("ThömasThörin", true)]
    [InlineData("karl-gunnar svensson-karlsson",true)]
    [InlineData("12  34", false)]
    public void ValidNameTest(string name, bool expected)
    {
        var result = ValidName(name);
        Assert.Equal(expected, result);
    }
    [Theory()]
    [InlineData("password123", "password123",true)]
    [InlineData("password123", "passwOrd123", false)]
    [InlineData("password123", "password321", false)]
    public void PasswordHashingTest(string pass1,string pass2,bool expected)
    {
        var testUser = new Customer() { Name="Betty Boop",Email="betty@boop.com"};
        var password = pass1;
        var hash = GetHashedPassword(testUser, password);
        testUser.Password = hash;

        var actual = ValidatePassword(testUser,pass2);

        Assert.Equal(expected, actual);
    }
    [Fact()]
    public void GetRandomPasswordShouldReturnCorrectLength()
    {
        const int expectedLength = 10;
        var actual = GetRandomPassword();

        Assert.Equal(expectedLength, actual.Length);
    }
}