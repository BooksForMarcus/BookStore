import { useState } from "react";
import { useRecoilState } from "recoil";
import loggedInUserState from "../../atoms/loggedInUserState";
import AdminUserEdit from "./AdminUserEdit";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faScrewdriverWrench,faLock,faLightbulb,faCommentDollar } from "@fortawesome/free-solid-svg-icons";

const AdminUserView = ({users,setUsers}) =>{
	const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);
	const [userIdToEdit, setUserIdToEdit] = useState(null);
	
	const getAllUsers = async () => {
	const requestOptions = {
		method: "GET",
		headers: {
		  Authorization: loggedInUser.password,
		  Accept: "application/json",
		  "Content-Type": "application/json",
		},
	  };
  
	  let resp = await fetch("/api/customer/admin/getusers", requestOptions);
	  if (resp.ok) {
		console.log("get users ok");
		let json = await resp.json();
		console.log(json);
		setUsers(json);
	  } else {
		console.log("could not get users");
	  }
	};

	return userIdToEdit===null?( 
		<div className="admin-user-list">
			{users === null && <button onClick={getAllUsers} disabled={loggedInUser === null}>Hämta alla kunder.</button>}
			{users !== null && users.map((user) => {
				return (
					<div className="user-list-item" key={user.id}>
						<div className="user-list-item-name">
							<p>{user.email}  -  {user.firstName} {user.lastName}</p>
						</div>
						<div className="user-list-item-util">
							{user.isAdmin && <FontAwesomeIcon icon={faScrewdriverWrench} />}
							{user.isBlocked && <FontAwesomeIcon icon={faLock} />}
							{user.isActive && <FontAwesomeIcon icon={faLightbulb} />}
							{user.isSeller && <FontAwesomeIcon icon={faCommentDollar} />}
							<button onClick={()=>setUserIdToEdit(user.id)}>Ändra</button>

						</div>
					</div>
				);
			})}
		</div>
	 ):(
		<AdminUserEdit userToEdit={users.find((u)=>u.id===userIdToEdit)} setUserToEdit={setUserIdToEdit} loggedInUser={loggedInUser} users={users} setUsers={setUsers}/>
	 );
}

export default AdminUserView;