﻿using BookStore.DTO;
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
			//make sure to strip id from sources such as swagger
			order.Id = String.Empty;

			await orders.InsertOneAsync(order);
			var result = !String.IsNullOrWhiteSpace(order.Id);
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

		//public async Task<bool> UpdateOrders(string customerId, string updatedorder )
  //      {
		//	var updatefilter = Builders<Order>.Filter.Eq("OrderId", customerId);
		//	var update = Builders<Order>.Update.Set("Order", updatedorder);
		//	var resp = await orders.UpdateOneAsync(updatefilter, update);
		//	return resp.IsAcknowledged;
		//}

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

