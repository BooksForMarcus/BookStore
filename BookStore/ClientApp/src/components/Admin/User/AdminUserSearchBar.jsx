import { useState } from "react";
import { useEffect } from "react";

const AdminUserSearchBar = ({users,setUsersToShow}) => {
	  const [searchString, setSearchString] = useState("");

	  useEffect(() => {
		const search = searchString.toLowerCase()
		if(search.length>1){
			setUsersToShow(users.filter((u)=> u.id.toLowerCase().includes(search) ||
											  u.firstName.toLowerCase().includes(search) ||
											  u.lastName.toLowerCase().includes(search) ||
											  u.email.toLowerCase().includes(search)))
		}else{
			setUsersToShow(null);
		}
	  }, [searchString]);


	return (
		<div className="admin-user-search-bar">
			<input type="text" value={searchString} onChange={(e)=>setSearchString(e.target.value.trim())} placeholder="Sök efter kund (minst 2 tecken)..." />
			<button onClick={()=>setSearchString("")} disabled={searchString===""}>Återställ</button>
		</div>
	  );
}

export default AdminUserSearchBar;