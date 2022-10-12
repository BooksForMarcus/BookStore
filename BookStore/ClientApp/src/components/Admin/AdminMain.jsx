import "./admin.css";
import AdminNav from "./AdminNav";
import { useState } from "react";
import AdminUserView from "./User/AdminUserView";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AdminBookView from "./Books/AdminBookView";
import AdminOrderView from "./Orders/AdminOrderView";
import AdminCategoryView from "./Categories/AdminCategoryView";
import AdminStatsMainView from "./Stats/AdminStatsMainView"

const AdminMain = ({user}) => {
  const [nav, setNav] = useState("users");
  const [users, setUsers] = useState(null);
  const [orders, setOrders] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user === null || (user!==null && user.isAdmin === false)) {
      navigate("/login");
    }
  }, []);

  return (
    <div className="admin-main">
      <AdminNav setNav={setNav} />
      {nav === "users" && <AdminUserView users={users} setUsers={setUsers} />}
	  {nav === "books" && <AdminBookView/>}
	  {nav === "orders" && <AdminOrderView orders={orders} setOrders={setOrders}/>}
      {nav === "category" && <AdminCategoryView/>}
      {nav === "stats" && <AdminStatsMainView/>}
    </div>
  );
};

export default AdminMain;
