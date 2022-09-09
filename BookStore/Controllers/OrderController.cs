using BookStore.DbAccess;
using BookStore.Models;
using Microsoft.AspNetCore.Mvc;

namespace BookStore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly OrderCRUD _orderCRUD;

        public OrderController(OrderCRUD orderCRUD) =>
       _orderCRUD = orderCRUD;

        // GET: api/<CustomerController>
        [HttpGet]
        public async Task<IEnumerable<Order>> Get()
        {
            return await _orderCRUD.GetAllOrders();
        }

        //// GET api/<CustomerController>/5
        //[HttpGet("{id}")]
        //public string Get(int id)
        //{
        //    return "value";
        //}

        // POST api/<CustomerController>
        [HttpPost]
        public async Task<IActionResult> Post(Order order)
        {
            var result = await _orderCRUD.CreateOrder(order);
            if (result) return Ok();
            else return BadRequest();
        }

        [HttpPut]
        public async Task<IActionResult> Put(Order order)
        {
            var result = await _orderCRUD.UpdateOrder(order);
            if (!String.IsNullOrWhiteSpace(order.Id)) return Ok();
            return BadRequest();
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(string id)
        {

            var result = await _orderCRUD.DeleteOrders(id);
            if(result) return Ok();
            return BadRequest();
        }

        //// PUT api/<CustomerController>/5
        //[HttpPut("{id}")]
        //public void Put(int id, [FromBody] string value)
        //{
        //}

        //// DELETE api/<CustomerController>/5
        //[HttpDelete("{id}")]
        //public void Delete(int id)
        //{
        //}
    }
}
