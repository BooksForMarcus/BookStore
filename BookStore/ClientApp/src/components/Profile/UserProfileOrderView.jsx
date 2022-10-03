import { useState, useEffect } from "react";
import "../../App.css";
import { useRecoilState } from "recoil";
import loggedInUserState from "../../atoms/loggedInUserState";
import { Link } from "react-router-dom";
import UserOrderListView from "./UserOrderListView";

function UserProfileOrderView() {
    const [user, setUser] = useRecoilState(loggedInUserState);
    const [orders, setOrders] = useState(null);
    const [view, setView] = useState("list");

    const getOrders = async () => {
            const requestOptions = {
                method: "GET",
                headers: {
                    Authorization: user.password,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            };

            let resp = await fetch("/api/Order/customer/getorders", requestOptions);
            if (resp.ok) {
                let json = await resp.json();
                setOrders(json);
            } else {

            }
    };

    useEffect(() => {
        if(orders===null){
            getOrders();
        }
      },[]);

    return (
        <div className="user-order-wrap">
            <h2 className="h2-light">Orderhistorik</h2>
            {orders !== null && view === "list" && <UserOrderListView orders={orders} setNav={setView}/>}
        </div>
    );
};

export default UserProfileOrderView;
