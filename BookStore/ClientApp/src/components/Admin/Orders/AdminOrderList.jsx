import AdminOrderListItem from "./AdminOrderListItem";

const AdminOrderList = ({orders,setNav,orderStatus}) => {
  return (
    <div className="admin-book-list">
      <header className="admin-order-list-item admin-book-list-item">
        <h3>Order#</h3>
        <h3>Datum</h3>
        <h3>Beställare</h3>
        <h3>Status</h3>
      </header>
      {orders !== null ?
        orders.map(o => <AdminOrderListItem key={"admin"+o.id} order={o} setNav={setNav} orderStatus={orderStatus}/>):null}
    </div>
  );
};

export default AdminOrderList;