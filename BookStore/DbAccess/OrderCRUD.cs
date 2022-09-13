using BookStore.Models;
using MongoDB.Driver;

namespace BookStore.DbAccess
{
    public class OrderCRUD
    {
		private IMongoCollection<Order> orders;
		private CustomerCrud customers;

		public OrderCRUD(MongoDbAccess db)
		{
			orders = db.OrdersCollection;
			customers = new CustomerCrud(db);
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
			//behöver ändras, bara exempel:
			var auth = new DTO.CustomerAuthorize() { Email = "hej", Password = "hej" };
			var resp = new List<Order>();
            var customer = await customers.Login(auth);
			if (customer is not null && customer.IsAdmin)
			{
				//get all orders?
			}
			else if(customers is not null)
			{
                //get all orders for one customer?
                resp = (await orders.FindAsync(o=> o.CustomerId ==customer.Id)).ToList();
            }
			//var resp = (await orders.FindAsync(_ => true)).ToList();
			return resp;
		}

		public async Task<bool> UpdateOrders(Order customerId, Order updatedorder )
        {
			var updatefilter = Builders<Order>.Filter.Eq("OrderId", customerId);
			var update = Builders<Order>.Update.Set("Order", updatedorder);
			var resp = await orders.UpdateOneAsync(updatefilter, update);
			return resp.IsAcknowledged;
		}

		//public async Task<bool> DeleteOrders(Order deletedOrder)
  //      {
		//	var deletefilter = Builders<Order>.Filter.Eq("OrderId",deletedOrder.Id);
		//	var result = await orders.DeleteOneAsync(d => d.Id == deletedOrder.Id);
		//	return result.IsAcknowledged && result.DeletedCount > 0;
		//}

		public async Task<bool> DeleteOrders(string id)
        {
			var result = false;
			if(id.Length == 24)
            {
				var resp = await orders.DeleteOneAsync(i => i.Id == id);
				result = resp.IsAcknowledged && resp.DeletedCount> 0;
            }
			return result;
        }

        public async Task<bool> UpdateOrder(Order updatedOrder)
        {
			var result = await orders.ReplaceOneAsync(o => o.Id == updatedOrder.Id, updatedOrder);
			return result.IsAcknowledged && result.ModifiedCount > 0;
		}
    }
}

