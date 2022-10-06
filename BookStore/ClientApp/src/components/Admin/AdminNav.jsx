const AdminNav = ({setNav})=> {
	return (
		<div className="admin-nav">
			<button onClick={()=>setNav("users")}>Användare</button>
			<button onClick={()=>setNav("orders")}>Beställningar</button>
			<button onClick={() => setNav("books")}>Böcker</button>
			<button onClick={() => setNav("category")}>Kategorier</button>
			<button onClick={() => setNav("stats")}>Statistik</button>
		</div>
	  );
}

export default AdminNav;