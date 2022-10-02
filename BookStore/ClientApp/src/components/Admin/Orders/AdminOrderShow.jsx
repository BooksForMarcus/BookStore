const AdminOrderShow = ({ order, setNav }) => {
  return (
    <div className="admin-order-show-container">
      <div className="admin-order-number">
        <h1>Order #{order.id}</h1>
      </div>
      <div className="admin-order-date">
        <p>
          Order skapad:{" "}
          {order.date.slice(0, 10) + ", " + order.date.slice(11, 19)}
        </p>
      </div>
	  <div className="admin-order-customer-name">
      <p>
        Beställare: {order.customer.firstName + " " + order.customer.lastName}
      </p>
	  </div>
      <div className="admin-order-status">
        <p>Status: {order.status}</p>
      </div>
	  <div className="admin-order-customer-email">
		<p>Email: {order.customer.email}</p>
	  </div>
	  <div className="admin-order-customer-address">
		<p >Adress: {order.customer.address}</p>
	  </div>
	  <div className="admin-order-items-container">
	  	<h3>Artiklar:</h3>
		<h4>Artikel nummer</h4>
		<h4>Titel</h4>
		<h4>Antal</h4>
		<h4>á pris</h4>
		<h4>Radsumma</h4>
		{order.books.map(b =>(
			<div className="admin-order-item">
				<p>{b.id}</p>
				<p>{b.title}</p>
				<p>{b.numInstock}</p>
				<p>{b.price}</p>
				<p>{b.numInstock*b.price}</p>
			</div>
		))}
		<h4 className="admin-order-items-total">Totalt:</h4>
		<p className="admin-order-items-number">{order.orderSum} kr</p>
		<h4 className="admin-order-items-vat">Varav moms:</h4>
		<p className="admin-order-items-number">{order.vat} kr</p>
	  </div>
      <div className="btn-area">
        <button onClick={() => setNav("list")}>Tillbaka</button>
      </div>
    </div>
  );
};

export default AdminOrderShow;
