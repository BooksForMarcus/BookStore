import { useState } from "react";
import { useRecoilValue } from "recoil";
import loggedInUserState from "../../../atoms/loggedInUserState";
import ModalBaseFull from "../../Modal/ModalBaseFull";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const AdminOrderShow = ({ order, setNav, orderStatus,orders,setOrders }) => {
	const [localStatus, setLocalStatus] = useState(order.status);
	const [orderUpdated,setOrderUpdated] = useState(null);
	const user = useRecoilValue(loggedInUserState);

	
	const updateOrder = async (e) => {
		e.preventDefault();
		const updatedOrder = {...order, status: localStatus};
		const requestOptions = {
		  method: "PUT",
		  headers: {
			Authorization: user.password,
			Accept: "application/json",
			"Content-Type": "application/json",
		  },
		  body: JSON.stringify(updatedOrder),
		};
	
		let resp = await fetch("/api/order/orderupdate", requestOptions);
		if (resp.ok) {
		  var newOrders = orders.filter((o) => o.id !== updatedOrder.id);
		  newOrders.push(updatedOrder);
		  newOrders.sort((a, b) => a.date.localeCompare(b.date));
		  setOrders(newOrders);
		  setOrderUpdated(true);
		} else {
		  setOrderUpdated(false);
		}
	  };

  return (
    <div className="admin-order-show-container">
	<button className="btn-x-mark" onClick={() => setNav("list")}>
        <FontAwesomeIcon icon={faXmark} />
      </button>
      <div className="admin-order-show">
	  {orderUpdated!==null &&
	  <ModalBaseFull>
	  <div className="modal-card">
        <h3>
          {orderUpdated
            ? "Beställningen har uppdaterats"
            : "Kunde inte uppdatera beställningen"}
        </h3>
        <button
          type="button"
          onClick={() => setOrderUpdated(null)}
          className="btn-call-to-action"
        >
          Ok
        </button>
      </div>
	  </ModalBaseFull>
	  
	  }
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
            Beställare:{" "}
            {order.customer.firstName + " " + order.customer.lastName}
          </p>
        </div>
        <div className="admin-order-status">
          <p>Status: </p>
		  <select value={localStatus} onChange={(e)=>setLocalStatus(e.target.value)}>
			<option value={orderStatus.PENDING} >Pågående</option>
			<option value={orderStatus.PROCESSING} >Behandlas</option>
			<option value={orderStatus.SHIPPED} >Skickad</option>
			<option value={orderStatus.CANCELED} >Avbruten</option>
			<option value={orderStatus.RETURNED} >Återbördad</option>
		  </select>
		  {localStatus!== order.status && <button type="button" onClick={updateOrder}>Uppdatera</button>}
        </div>
        <div className="admin-order-customer-email">
          <p>Email: {order.customer.email}</p>
        </div>
        <div className="admin-order-customer-address">
          <p>Adress: {order.customer.address}</p>
        </div>
        <div className="admin-order-items-container">
          <h3>Artiklar:</h3>
          <h4>Artikel nummer</h4>
          <h4>Titel</h4>
          <h4>Antal</h4>
          <h4>á pris</h4>
          <h4>Radsumma</h4>
          {order.books.map((b) => (
            <div key={"order-book-" + b.id} className="admin-order-item">
              <p>{b.id}</p>
              <p>{b.title}</p>
              <p>{b.numInstock}</p>
              <p>{b.price} kr</p>
              <p>{b.numInstock * b.price} kr</p>
            </div>
          ))}
          <h4 className="admin-order-items-total">Porto:</h4>
          <p className="admin-order-items-number">{order.postage} kr</p>
          <h4 className="admin-order-items-total">Totalt:</h4>
          <p className="admin-order-items-number">{order.orderSum} kr</p>
          <h4 className="admin-order-items-vat">Varav moms:</h4>
          <p className="admin-order-items-number">{order.vat} kr</p>
        </div>
        <div className="btn-area">
          <button onClick={() => setNav("list")}>Stäng</button>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderShow;
