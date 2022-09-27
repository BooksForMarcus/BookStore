import "./admin.css";
import AdminNav from "./AdminNav";
import { useState } from "react";
import AdminUserView from "./AdminUserView";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const AdminMain = (user) => {
  const [nav, setNav] = useState("users");
  const [users, setUsers] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user === null || user.isAdmin === false) {
      navigate("/login");
    }
  }, []);

  return (
    <div className="admin-main">
      <AdminNav setNav={setNav} />
      {nav === "users" && <AdminUserView users={users} setUsers={setUsers} />}
    </div>
  );
};

export default AdminMain;
