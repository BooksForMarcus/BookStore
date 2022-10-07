import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import loggedInUserState from "../../../atoms/loggedInUserState";
import AdminOrderList from "./AdminOrderList";
import AdminOrderNav from "./AdminOrderNav";
import AdminOrderShow from "./AdminOrderShow";
import { orderStatus } from "../../../script/orderStatus";

const AdminOrderView = ({ orders, setOrders }) => {
  const [user, setUser] = useRecoilState(loggedInUserState);
  const [nav, setNav] = useState("list");
  const [localOrders, setLocalOrders] = useState(orders);

  const getAllOrders = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: user.password,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    let resp = await fetch("/api/order/admin/getorders", requestOptions);
    if (resp.ok) {
      let json = await resp.json();
      setOrders(json);
	  setLocalOrders(json);
    } else {
      //maybe do something here?
    }
  };

  return (
    <div className="admin-order-view">
      <AdminOrderNav orders={orders} setLocalOrders={setLocalOrders} orderStatus={orderStatus}/>
      {orders === null && (
        <button onClick={getAllOrders}>Hämta alla ordrar.</button>
      )}
      {orders !== null && nav === "list" && (
        <AdminOrderList orders={localOrders} setNav={setNav} orderStatus={orderStatus} />
      )}
      {orders !== null && nav.includes("show-") && (
        <AdminOrderShow
          order={orders.find((o) => o.ordernumber === nav.split("-")[1])}
          setNav={setNav} orderStatus={orderStatus}
		  orders={orders} setOrders={setOrders}
        />
      )}
    </div>
  );
};

export default AdminOrderView;
