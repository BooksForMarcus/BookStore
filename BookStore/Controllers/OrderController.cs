using BookStore.Authorize;
using BookStore.DbAccess;
using BookStore.DTO;
using BookStore.Models;
using Microsoft.AspNetCore.Mvc;

namespace BookStore.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly OrderCRUD _orderCRUD;
        

        public OrderController(OrderCRUD orderCRUD) =>
       _orderCRUD = orderCRUD;

        /// <summary>
        /// Gets a list of all the orders. (Basic Auth required).
        /// </summary>
        /// <returns>A list of all the customer.</returns>
        /// <response code="200">Call ok.</response>
        [HttpGet("admin/getorders")]
        public async Task<IActionResult> GetOrders()
        {
            var cust = HttpContext.Items["Customer"] as Customer;
            if (cust is not null && cust.IsAdmin)
            {
                return Ok(await _orderCRUD.GetAllOrders());
            }
            else
                return BadRequest(new { error = "Need admin priviledge to access customer list." });
        }

        //[HttpGet("customer/getorders")]

        //public async Task<IActionResult> CustomerGetOrder(Order order)
        //{
        //    var cust = HttpContext.Items["Customer"] as Customer;
        //    if(cust is not null)
        //    {
        //        var result = await _orderCRUD.CustomerGetOrder(order);
        //        return Ok(result);
        //    }
        //    return BadRequest();
        //}

        /// <summary>
        /// Post an object to create a new order (Basic Auth NOT required).
        /// </summary>
        /// <param name="order"></param>
        /// <returns>A List of the order</returns>
        /// 
        [HttpPost]
        [AllowAnonymous]
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
