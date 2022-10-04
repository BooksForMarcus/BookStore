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

		public OrderCRUD(MongoDbAccess db)
		{
			orders = db.OrdersCollection;
			customers = new CustomerCrud(db);
		}

		public async Task<bool> CreateOrder(Order order)
		{
			//make sure to strip id from sources such as swagger
			order.Id = String.Empty;
			var mail = new MailHelper();
			
			await orders.InsertOneAsync(order);
			var result = !String.IsNullOrWhiteSpace(order.Id);
            if (result)
            {
				if (EnvironmentHelper.IsDev)
				{
					Console.WriteLine(result);
				}
				else
				{
					mail.SendMail(
						order.Customer.Email,
						$"Orderbekräftelse för {order.Ordernumber}",
						$"Hej {order.Customer.FirstName}!<br><br>Din order är lagd. Du har beställt {order}<br><br>Mvh. Bokcirkeln.");

				}
				
            }

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

