namespace BookStore.Enums;

using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

/// <summary>
/// Enum for displaying status of an order
/// </summary>
/// <remarks>
/// 0 - Pending<br/>
/// 1 - Processing<br/>
/// 2 - Shipped<br/>
/// 3 - Canceled<br/>
/// 4 - Returned
/// </remarks>
public enum OrderStatus
{
    Pending,
    Processing,
    Shipped,
    Canceled,
    Returned
}
