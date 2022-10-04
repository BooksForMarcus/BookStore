namespace BookStoreTests.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;
using static BookStore.Helpers.BookHelper;

public class BookHelperTests
{
    [Theory]
    [InlineData(50, 101.01)]
    [InlineData(100, 202.02)]
    [InlineData(200, 404.04)]
    [InlineData(1000, 2020.2)]
    [InlineData(-5, 0)]
    public void AmountOfPagesInputShouldReturnCorrectWeight(int pages, float expected)
    {
        var actual = GetBookWeight(pages);
        Assert.Equal(expected, actual, 2);
    }
    [Theory]
    [InlineData(750.77, 91)]
    [InlineData(-100, 0)]
    [InlineData(200005.3f, 1000)]
    [InlineData(25, 13)]
    [InlineData(11111, 265)]
    public void GivenWeightShouldReturnCorrectPostagePrice(float weightInGrams, int expected)
    {
        var actual = GetPostagePrice(weightInGrams);
        Assert.Equal(expected, actual);
    }
}
