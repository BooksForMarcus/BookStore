import { useState } from "react";
import { useEffect } from "react";

const AdminUserSearchBar = ({users,setUsersToShow}) => {
	  const [searchString, setSearchString] = useState("");

	  useEffect(() => {
		if(searchString.length>1){
			if("0123456789".includes(searchString[0])){
				setUsersToShow(users.filter((u) => u.id.toLowerCase().includes(searchString.toLowerCase())));
			}
			else{
				setUsersToShow(users.filter((u) => u.email.toLowerCase().includes(searchString.toLowerCase())));
			}
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