const AdminOrderListItem = ({ order, setNav, orderStatus }) => {
  const translateStatus = () => {
      switch (order.status) {
        case orderStatus.PENDING:
          return orderStatus.PENDING_SV;
        case orderStatus.PROCESSING:
          return orderStatus.PROCESSING_SV;
        case orderStatus.SHIPPED:
          return orderStatus.SHIPPED_SV;
        case orderStatus.CANCELED:
          return orderStatus.CANCELED_SV;
        case orderStatus.RETURNED:
          return orderStatus.RETURNED_SV;
        default:
          return "Okänd status";
      
    }
  };

  return (
    <div
      className="admin-order-list-item admin-book-list-item"
      onClick={() => setNav("show-" + order.id)}
    >
      <p>{order.id}</p>
      <p>{order.date.slice(0, 10) + ", " + order.date.slice(11, 19)}</p>
      <p>{order.customer.firstName + " " + order.customer.lastName}</p>
      <p>{translateStatus()}</p>
    </div>
  );
};

export default AdminOrderListItem;
