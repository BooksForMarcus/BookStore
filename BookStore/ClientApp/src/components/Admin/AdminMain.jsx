import "./admin.css";
import AdminNav from "./AdminNav";
import { useState } from "react";
import AdminUserView from "./User/AdminUserView";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AdminBookView from "./Books/AdminBookView";

const AdminMain = ({user}) => {
  const [nav, setNav] = useState("users");
  const [users, setUsers] = useState(null);
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
    </div>
  );
};

export default AdminMain;
