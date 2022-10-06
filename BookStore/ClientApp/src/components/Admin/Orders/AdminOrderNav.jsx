import { useState, useEffect } from "react";

const AdminOrderNav = ({ orders, setLocalOrders,orderStatus }) => {
  const [filteredOrders, setFilteredOrders] = useState(orders);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const updateSearch = () => {
    if (searchTerm.length > 1) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      if (filteredOrders !== null) {
        const searchedOrders = filteredOrders.filter(
          (o) =>
            o.id.toLowerCase().includes(lowerSearchTerm) ||
            o.date.toLowerCase().includes(lowerSearchTerm) ||
            o.customer.email.toLowerCase().includes(lowerSearchTerm) ||
            o.customer.firstName.toLowerCase().includes(lowerSearchTerm) ||
            o.customer.lastName.toLowerCase().includes(lowerSearchTerm)
        );
        setLocalOrders(searchedOrders);
      } else {
        setLocalOrders(filteredOrders);
      }
    }
  };

  useEffect(() => {
    let newOrderArr = [];
    switch (filter) {
      case orderStatus.PENDING:
        newOrderArr = orders.filter((o) => o.status === orderStatus.PENDING);
        break;
      case orderStatus.PROCESSING:
        newOrderArr = orders.filter((o) => o.status === orderStatus.PROCESSING);
        break;
      case orderStatus.SHIPPED:
        newOrderArr = orders.filter((o) => o.status === orderStatus.SHIPPED);
        break;
		case orderStatus.CANCELED:
        newOrderArr = orders.filter((o) => o.status === orderStatus.CANCELED);
        break;
		case orderStatus.RETURNED:
        newOrderArr = orders.filter((o) => o.status === orderStatus.RETURNED);
        break;
      default:
        newOrderArr = orders;
        break;
    }
    setFilteredOrders(newOrderArr);
    setLocalOrders(newOrderArr);
    updateSearch();
  }, [filter, orders]);

  useEffect(() => {
    updateSearch();
  }, [searchTerm, filteredOrders]);
  useEffect(() => {
    setFilteredOrders(orders);
  }, [orders]);

  return (
    <div className="admin-order-nav-bar">
      <div className="admin-book-search">
        <label htmlFor="search">Sök böcker</label>
        <input
          type="text"
          id="search"
          placeholder="Sök efter Order#, datum eller beställare..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value.trimStart())}
        />
      </div>
      <form className="admin-book-filter">
        <fieldset>
          <legend>Filter, Status</legend>
          <label>
            <input
              type="radio"
              name="filter"
              value="all"
              checked={filter === "all"}
              onChange={(e) => setFilter(e.target.value)}
            />
            Alla
          </label>
          <label>
            <input
              type="radio"
              name="filter"
              value={orderStatus.PENDING}
              checked={filter === orderStatus.PENDING}
              onChange={(e) => setFilter(e.target.value)}
            />
            {orderStatus.PENDING_SV}
          </label>
          <label>
            <input
              type="radio"
              name="filter"
              value={orderStatus.PROCESSING}
              checked={filter === orderStatus.PROCESSING}
              onChange={(e) => setFilter(e.target.value)}
            />
            {orderStatus.PROCESSING_SV}
          </label>
          <label>
            <input
              type="radio"
              name="filter"
              value={orderStatus.SHIPPED}
              checked={filter === orderStatus.SHIPPED}
              onChange={(e) => setFilter(e.target.value)}
            />
            {orderStatus.SHIPPED_SV}
          </label>
          <label>
            <input
              type="radio"
              name="filter"
              value={orderStatus.CANCELED}
              checked={filter === orderStatus.CANCELED}
              onChange={(e) => setFilter(e.target.value)}
            />
            {orderStatus.CANCELED_SV}
          </label>
          <label>
            <input
              type="radio"
              name="filter"
              value={orderStatus.RETURNED}
              checked={filter === orderStatus.RETURNED}
              onChange={(e) => setFilter(e.target.value)}
            />
            {orderStatus.RETURNED_SV}
          </label>
        </fieldset>
      </form>
      <button
        onClick={() => {
          setFilter("all");
          setSearchTerm("");
        }}
        className="btn-admin-book-nav-reset"
      >
        Återställ sökning
      </button>
    </div>
  );
};

export default AdminOrderNav;
