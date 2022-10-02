const AdminOrderListItem = ({order,setNav}) => {
	return (
		<div className="admin-order-list-item admin-book-list-item" onClick={()=>setNav("show-"+order.id)}>
			<p>{order.id}</p>
			<p>{order.date.slice(0,10)+", "+order.date.slice(11,19)}</p>
			<p>{order.customer.firstName + " " + order.customer.lastName}</p>
			<p>{order.status}</p>
		</div>
	  );
}

export default AdminOrderListItem;