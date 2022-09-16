import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import UpdateOk from "./UpdateOk";
import UpdateFailed from "./UpdateFailed";


const AdminUserEdit= ({userToEdit,setUserToEdit,loggedInUser,users,setUsers}) =>{
	const [email, setEmail] = useState(userToEdit.email);
	const [firstName, setFirstName] = useState(userToEdit.firstName);
	const [lastName, setLastName] = useState(userToEdit.lastName);
	const [password, setPassword] = useState("");
	const [address, setAddress] = useState(userToEdit.address);
	const [isAdmin, setIsAdmin] = useState(userToEdit.isAdmin);
	const [isSeller, setIsSeller] = useState(userToEdit.isSeller);
	const [isBlocked, setIsBlocked] = useState(userToEdit.isBlocked);
	const [isActive, setIsActive] = useState(userToEdit.isActive);
	const [updateOk, setUpdateOk] = useState(null);
	
	const sendUpdatedUserToApi = async (e) => {
		e.preventDefault();
		console.log("In adminUserEdit: loggedInUser: ", loggedInUser);
		const updatedUser = {
			id: userToEdit.id,
			email: email,
			firstName: firstName,
			lastName: lastName,
			password: password,
			address: address,
			isAdmin: isAdmin,
			isSeller: isSeller,
			isBlocked: isBlocked,
			isActive: isActive
		}
		const requestOptions = {
			method: "PUT",
			headers: {
			  Authorization: loggedInUser.password,
			  Accept: "application/json",
			  "Content-Type": "application/json",
			},
			body: JSON.stringify(updatedUser),
		  };
	  
		  let resp = await fetch("/api/customer/updatecustomer", requestOptions);
		  if (resp.ok) {
			console.log("in adminUseredit: resp ok");
			let json = await resp.json();
			console.log(json);
			setUpdateOk(true);
			var newUsers = users.filter(x=>x.id!==userToEdit.id);
			newUsers.push(updatedUser);
			newUsers.sort((a,b)=>{
				const emailA = a.email.toUpperCase();
				const emailB = b.email.toUpperCase();
				if (emailA < emailB) {
					return -1;
				}
				if (emailA > emailB) {
					return 1;
				}
				return 0;
			})
			setUsers(newUsers);
		  } else {
			setUpdateOk(false);
		}
	}
	

	return ( 
		<div className="admin-user-edit">
		{updateOk===true && <UpdateOk />}
		{updateOk===false && <UpdateFailed />}
		<button className="btn-x-mark" onClick={()=>setUserToEdit(null)}><FontAwesomeIcon icon={faXmark}/></button>
			<h2>Ändra användare</h2>
			<form onSubmit={sendUpdatedUserToApi}>
				<label htmlFor="email">Email</label>
				<input type="text" id="email" value={email} onChange={(e)=>setEmail(e.target.value)} required/>
				<label htmlFor="firstName">Förnamn</label>
				<input type="text" id="firstName" value={firstName} onChange={(e)=>setFirstName(e.target.value)} required/>
				<label htmlFor="lastName">Efternamn</label>
				<input type="text" id="lastName" value={lastName} onChange={(e)=>setLastName(e.target.value)} required/>
				<label htmlFor="address">Adress</label>
				<input type="text" id="address" value={address} onChange={(e)=>setAddress(e.target.value)} />
				<label htmlFor="password">Lösenord</label>
				<input type="text" id="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
				<div className="admin-user-edit-checkbox-area">
					<div>
						<label htmlFor="isAdmin">Administratör</label>
						{userToEdit.id!==loggedInUser.id && <input type="checkbox" id="isAdmin" checked={isAdmin} onChange={(e)=>setIsAdmin(e.target.checked)} />}
					</div>
					<div>
						<label htmlFor="isSeller">Säljare</label>
						<input type="checkbox" id="isSeller" checked={isSeller} onChange={(e)=>setIsSeller(e.target.checked)} />
					</div>
					<div>
						<label htmlFor="isBlocked">Blockerad</label>
						<input type="checkbox" id="isBlocked" checked={isBlocked} onChange={(e)=>setIsBlocked(e.target.checked)} />
					</div>
					<div>
						<label htmlFor="isActive">Konto aktivt</label>
						<input type="checkbox" id="isActive" checked={isActive} onChange={(e)=>setIsActive(e.target.checked)} />
					</div>
				</div>
				<button type="submit">Spara</button>
			</form>
			<button onClick={()=>setUserToEdit(null)}>Stäng</button>
		</div>
	 );
}

export default AdminUserEdit;