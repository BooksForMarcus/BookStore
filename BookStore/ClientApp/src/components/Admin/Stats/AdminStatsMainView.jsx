import { useState } from "react";
import { useRecoilState } from "recoil";
import loggedInUserState from "../../../atoms/loggedInUserState";

const AdminStatsMainView = ({  }) => {
  const [user, setUser] = useRecoilState(loggedInUserState);
  const [orders, setOrders] = useState(null);
  const [users, setUsers] = useState(null);

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

    }
  };

  const getAllUsers = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: loggedInUser.password,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    let resp = await fetch("/api/customer/admin/getusers", requestOptions);
    if (resp.ok) {
      let json = await resp.json();
      setUsers(json);
    } else {
      //maybe do something here?
    }
  };

  useEffect(() => {
    if(orders===null || users === null){
        getAllOrders();
        getAllUsers();
    }
  },[]);

  return (
    <div className="admin-stats-view">
        <h1>Statistik</h1>
    </div>
  );
};

export default AdminStatsMainView;
