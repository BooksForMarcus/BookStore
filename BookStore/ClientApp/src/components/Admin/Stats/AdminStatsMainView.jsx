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

  const getTopTenCustomers = () => {
	var distinctCustomers = [...new Set(orders.map(o => o.customer.id))];
	var customerOrderSum = [];
	distinctCustomers.forEach(c => {
		var customerOrders = orders.filter(o => o.customer.id === c);
		const firstName = customerOrders[0].customer.firstName;
		const lastName = customerOrders[0].customer.lastName;
		var sum = 0;
		customerOrders.forEach(o => sum += (o.orderSum-o.postage));
		customerOrderSum.push({id: c, sum: sum, name: firstName + " " + lastName});
	});
	var sortedCustomerOrderSum = customerOrderSum.sort((a, b) => b.sum - a.sum);
	var topTenCustomers = sortedCustomerOrderSum.splice(0, 10);
	return topTenCustomers;
  }

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
      <div className="admin-stats-wrapper-1">
        <div className="admin-stats-container-1">
          <div className="admin-stats-body-1">
            <div className="admin-stats-header-1">
              <h3 className="admin-stats-header-1-text">Top 10 kunder</h3>
            </div>
            <div className="admin-stats-items-1">
              {orders != null ? (
                getTopTenCustomers().map((c) => (
                  <div className="admin-stats-item-1" key={"topCustomer" + c.id}>
                    <span>{c.name}</span>
                    <span>{c.sum} kr</span>
                  </div>
                ))
                ) : 
                (
                <span>tom</span>
              )}
            </div>
          </div>
        <div className="admin-stats-container-2">
          <div className="admin-stats-body-1">
            <div className="admin-stats-header-1">
              <h3 className="admin-stats-header-1-text">Total f??rs??ljning</h3>
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
                Antal s??lda artiklar
              </h3>
            </div>
            <div className="admin-stats-items-1">
              <span className="admin-stats-sum-text">
                {getTotalItemsNumbers()} st
              </span>
            </div>
          </div>
        </div>
        </div>
        <div className="admin-stats-by-date-container">
          <div className="admin-stats-by-date-container-1">
          <div className="admin-stats-by-date-datecomponent">
		        <label>Start datum
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              </label>
		        <label>Slut datum
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
            />
            </label>
          </div>
          <div className="admin-stats-body-1">
            <div className="admin-stats-header-1">
              <h3 className="admin-stats-header-1-text">Ordersumma f??r perioden:</h3>
            </div>
            <div className="admin-stats-items-1">
              <span className="admin-stats-sum-text">
              {dateFilteredOrders===null?0:dateFilteredOrders.reduce((total,order) =>total+(order.orderSum-order.postage),0)} sek
              </span>
            </div>
          </div>
          </div>
          <div className="admin-stats-items-1">
          <h3 className="admin-stats-header-2-text">Ordrar f??r perioden:</h3>
          <div className="admin-stats-item-header-container">
            <span className="admin-stats-item-header-text-id">Order ID</span>
            <span className="admin-stats-item-header-text">Datum</span>
            <span className="admin-stats-item-header-text">Summa</span>
          </div>
            {dateFilteredOrders !== null ? (
              dateFilteredOrders.map((o) => (
              <div className="admin-stats-by-date-item" key={"orders" + o.id}>
              <span className="admin-stats-item-text-id">{o.id}</span>
              <span className="admin-stats-item-text">{o.date.slice(0,10)}</span>
              <span className="admin-stats-item-text">{o.orderSum - o.postage}</span>
              </div>
            ))
            ) : (
            <p>tom</p>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStatsMainView;
