using BookStore.DTO;
using BookStore.Helpers;
using BookStore.Models;
using MongoDB.Driver;

namespace BookStore.DbAccess
{
    public class OrderCRUD
    {
		private IMongoCollection<Order> orders;
		private CustomerCrud customers;
		private BookCrud books;
        private OrderProcessor orderProcessor;

        public OrderCRUD(MongoDbAccess db, OrderProcessor orderProcessor)
        {
            orders = db.OrdersCollection;
            customers = new CustomerCrud(db);
            this.orderProcessor = orderProcessor;
        }

		public async Task<bool> CreateOrder(Order order)
		{
			//make sure to strip id from sources such as swagger
			order.Id = String.Empty;
            var processedOrder = await orderProcessor.Process(order);
            await orders.InsertOneAsync(processedOrder);
			var result = !String.IsNullOrWhiteSpace(processedOrder.Id);
			if (result) orderProcessor.SendMailsAsRequired(order);
			return result;
		}

        public async Task<List<Order>> AdminGetAllOrders()
		{
			var resp = await orders.FindAsync(_ => true);
			return resp.ToList().OrderBy(o=>o.Date).ToList();
		}

        public async Task<List<Order>> GetAllOrders()
		{
		    var resp = await orders.FindAsync(_ => true);
			var result = resp.ToList();
			return result;
		}

		public async Task<List<Order>> CustomerGetOrders(string id)
        {
			var resp = await orders.FindAsync(x=>x.Customer.Id == id);
			return resp.ToList();
		}


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

