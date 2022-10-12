import { translateStatus } from "../../../script/orderStatus";

const AdminOrderListItem = ({ order, setNav, orderStatus }) => {

  return (
    <div
      className="admin-order-list-item admin-book-list-item"
      onClick={() => setNav("show-" + order.id)}
    >
      <p>{order.id}</p>
      <p>{order.date.slice(0, 10) + ", " + order.date.slice(11, 19)}</p>
      <p>{order.customer.firstName + " " + order.customer.lastName}</p>
      <p>{translateStatus(order.status)}</p>
    </div>
  );
};

export default AdminOrderListItem;
