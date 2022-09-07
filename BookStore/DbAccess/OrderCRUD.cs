using BookStore.Models;
using MongoDB.Driver;

namespace BookStore.DbAccess
{
    public class OrderCRUD
    {
		private IMongoCollection<Order> orders;
		public OrderCRUD(MongoDbAccess db)
		{
			orders = db.OrdersCollection;
		}

		public async Task<bool> CreateOrder(Order order)
		{
			await orders.InsertOneAsync(order);
			var result = !String.IsNullOrWhiteSpace(order.CustomerId);
			return result;
		}
		public async Task<List<Order>> GetAllOrders()
		{
			var resp = (await orders.FindAsync(_ => true)).ToList();
			return resp;
		}

		public async Task<bool> UpdateOrders()
        {
			throw new NotImplementedException();
        }

		public async Task<bool> DeleteOrders()
        {
			throw new NotImplementedException();
        }
	}
}

