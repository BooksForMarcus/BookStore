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
			order.Id = "";
			await orders.InsertOneAsync(order);
			var result = !String.IsNullOrWhiteSpace(order.Id);
			return result;
		}
		public async Task<List<Order>> GetAllOrders()
		{
			var resp = (await orders.FindAsync(_ => true)).ToList();
			return resp;
		}

		public async Task<bool> UpdateOrders(Order customerId, Order updatedorder )
        {
			var updatefilter = Builders<Order>.Filter.Eq("OrderId", customerId);
			var update = Builders<Order>.Update.Set("Order", updatedorder);
			var resp = await orders.UpdateOneAsync(updatefilter, update);
			return resp.IsAcknowledged;
		}

		public async Task<bool> DeleteOrders(Order deletedOrder)
        {
			var deletefilter = Builders<Order>.Filter.Eq("OrderId",deletedOrder.Id);
			var result = await orders.DeleteOneAsync(d => d.Id == deletedOrder.Id);
			return result.IsAcknowledged && result.DeletedCount > 0;
		}

        public async Task<bool> UpdateOrder(Order updatedOrder)
        {
			var result = await orders.ReplaceOneAsync(o => o.Id == updatedOrder.Id, updatedOrder);
			return result.IsAcknowledged && result.ModifiedCount > 0;
		}
    }
}

