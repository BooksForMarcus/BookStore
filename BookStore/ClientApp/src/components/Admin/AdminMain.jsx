import "./admin.css";
import AdminNav from "./AdminNav";
import { useState } from "react";
import AdminUserView from "./AdminUserView";

const AdminMain = ({user}) => {
  const [nav, setNav] = useState("users");
  const [users, setUsers] = useState(null);
  
  return user!==null && user.isAdmin?(
    <div className="admin-main">
      <AdminNav setNav={setNav} />
      {nav === "users" && <AdminUserView users={users} setUsers={setUsers} />}
    </div>
  ):(
	<div className="admin-main">
		Please log in with admin account.
	</div>
  );
};

export default AdminMain;
