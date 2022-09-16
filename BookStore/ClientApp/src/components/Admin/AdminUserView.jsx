import { useRecoilState } from "recoil";
import userState from "../../atoms/userState";

const AdminUserView = ({users,setUsers}) =>{
	const [user, setUser] = useRecoilState(userState);
	
	const getAllUsers = async () => {
	const requestOptions = {
		method: "GET",
		headers: {
		  Authorization: user.password,
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

	return ( 
		<div className="admin-user-view">
			{users === null && <button onClick={getAllUsers} disabled={user === null}>Fetch all users.</button>}
			{users !== null && users.map((user) => {
				return (
					<div className="user-list-item" key={user.id}>
						<p>{user.email}  -  {user.firstName} {user.lastName}</p>
					</div>
				);
			})}
		</div>
	 );
}

export default AdminUserView;