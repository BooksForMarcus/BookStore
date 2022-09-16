import "./admin.css";
import AdminNav from "./AdminNav";
import { useState } from "react";
import AdminUserView from "./AdminUserView";

const AdminMain = () => {
  const [nav, setNav] = useState("users");
  const [users, setUsers] = useState(null);
  return (
    <div className="admin-main">
      <AdminNav setNav={setNav} />
      {nav === "users" && <AdminUserView users={users} setUsers={setUsers} />}
    </div>
  );
};

export default AdminMain;
