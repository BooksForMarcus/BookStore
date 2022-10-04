import { useState,useEffect } from "react";
import { useRecoilState } from "recoil";
import loggedInUserState from "../../../atoms/loggedInUserState";
import AdminOrderList from "./AdminOrderList";
import AdminOrderShow from "./AdminOrderShow";

const AdminOrderView = ({orders,setOrders}) => {
  const [user,setUser] = useRecoilState(loggedInUserState);
  const [nav,setNav] = useState("list");

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
    } else {
      //maybe do something here?
    }
  };

  return (
    <div className="admin-order-view">
	<div className="admin-order-nav-bar">
      <h1>Admin order nav ph</h1>
	</div>
      {orders === null && <button onClick={getAllOrders}>Hämta alla ordrar.</button>}
	  {orders !== null && nav==="list" && <AdminOrderList orders={orders} setNav={setNav}/>}
	  {orders !== null && nav.includes("show-") && <AdminOrderShow order={orders.find(o=>o.ordernumber === nav.split("-")[1])} setNav={setNav}/>}
    </div>
  );
};

export default AdminOrderView;
