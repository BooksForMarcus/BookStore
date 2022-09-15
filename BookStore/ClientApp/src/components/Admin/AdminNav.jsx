const AdminNav = ({setNav})=> {
	return (
		<div className="admin-nav">
			<button onClick={()=>setNav("users")}>Users</button>
			<button onClick={()=>setNav("orders")}>Orders</button>
			<button onClick={()=>setNav("books")}>Books</button>
		</div>
	  );
}

export default AdminNav;