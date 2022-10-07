import { StayCurrentLandscapeTwoTone } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import loggedInUserState from "../../../atoms/loggedInUserState";
import "./AdminStatsStyle.css";

const AdminStatsMainView = ({}) => {
  const [user] = useRecoilState(loggedInUserState);
  const [orders, setOrders] = useState(null);
  const [users, setUsers] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dateFilteredOrders, setDateFilteredOrders] = useState(orders);

  if (startDate === "" || endDate === "") {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    const yyyy = today.getFullYear();
    const todayDate = yyyy + "-" + mm + "-" + dd;
    setStartDate(todayDate);
    setEndDate(todayDate);
  }
  useEffect(() => {
    if (endDate < startDate) {
      setEndDate(startDate);
    }
    if (dateFilteredOrders !== null) {
      setDateFilteredOrders(
        orders.filter(
          (o) =>
            o.date.slice(0, 10) >= startDate && o.date.slice(0, 10) <= endDate
        )
      );
    }
  }, [startDate, endDate]);

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
	  setDateFilteredOrders(json.filter(
		(o) =>
		  o.date.slice(0, 10) >= startDate && o.date.slice(0, 10) <= endDate
	  ));
    } else {
    }
  };

  const getAllUsers = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: user.password,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    let resp = await fetch("/api/customer/admin/getusers", requestOptions);
    if (resp.ok) {
      let json = await resp.json();
      setUsers(json);
    } else {
    }
  };

  useEffect(() => {
    if (orders === null || users === null) {
      getAllOrders();
      getAllUsers();
    }
  }, []);

  const getTopTenOrders = () => {
    var sortedorders = [...orders].sort((a, b) => b.orderSum > a.orderSum);
    var topTenOrders = sortedorders.splice(0, 10);

    return topTenOrders;
  };

  const getTotalSellNumbers = () => {
    var getAllOrderSums = orders?.map((o) => o.orderSum - o.postage).flat();
    const totalStoreSum = getAllOrderSums?.reduce((accumulator, value) => {
      return accumulator + value;
    }, 0);

    return totalStoreSum;
  };

  const getTotalItemsNumbers = () => {
    var getAllOrderedBooks = orders
      ?.map((o) => o.books.map((ob) => ob.id))
      .flat();
    const totalItemsSum = getAllOrderedBooks?.length;

    return totalItemsSum;
  };

  return (
    <div className="admin-stats-view">
      <h1>Bokcirkelns Statistik</h1>
      <div className="admin-stats-container-1">
        <div className="admin-stats-body-1">
          <div className="admin-stats-header-1">
            <h3 className="admin-stats-header-1-text">Top 10 kunder</h3>
          </div>
          <div className="admin-stats-items-1">
            {orders != null ? (
              getTopTenOrders().map((c) => (
                <div className="admin-stats-item-1" key={"topCustomer" + c.id}>
                  <span>
                    {c.customer.firstName} {c.customer.lastName}
                  </span>
                  <span>{c.orderSum} kr</span>
                </div>
              ))
            ) : (
              <span>tom</span>
            )}
          </div>
        </div>
        <div className="admin-stats-container-2">
          <div className="admin-stats-body-1">
            <div className="admin-stats-header-1">
              <h3 className="admin-stats-header-1-text">Total försäljning</h3>
            </div>
            <div className="admin-stats-items-1">
              <span className="admin-stats-sum-text">
                {getTotalSellNumbers()} sek
              </span>
            </div>
          </div>
          <div className="admin-stats-body-1">
            <div className="admin-stats-header-1">
              <h3 className="admin-stats-header-1-text">
                Antal sålda artiklar
              </h3>
            </div>
            <div className="admin-stats-items-1">
              <span className="admin-stats-sum-text">
                {getTotalItemsNumbers()} st
              </span>
            </div>
          </div>
        </div>
		<label>Start datum
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        /></label>
		<label>Slut datum
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        /></label>
		Orrdersumma för perioden: {dateFilteredOrders===null?0:dateFilteredOrders.reduce((total,order) =>total+order.orderSum,0)}
        {dateFilteredOrders !== null ? (
          dateFilteredOrders.map((o) => (
            <p>
              {o.id}</p>
          ))
        ) : (
          <p>tom</p>
        )}

      </div>
    </div>
  );
};

export default AdminStatsMainView;
