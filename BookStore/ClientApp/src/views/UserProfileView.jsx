import React from "react";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import "../App.css";
import { useRecoilState } from "recoil";
import loggedInUserState from "../atoms/loggedInUserState";
import getBasicAuthString from "../getBasicAuthString";

function UserProfileView() {
  const [user,setUser] = useRecoilState(loggedInUserState);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [address, setAddress] = useState(user.address==="string"?"":user.address);

  const updateCustomer = async (e) => {
    e.preventDefault();

    const newUser = JSON.stringify({
      email: email,
      firstName: firstName,
      lastName: lastName,
      password: password,
      address: address,
    });
    console.log(newUser);
    const requestOptions = {
      method: "PUT",
      headers: {
        Authorization: user.password,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: newUser,
    };
    //let json = null;
    let resp = await fetch("/api/customer/updatecustomer", requestOptions);
    if (resp.ok) {
      console.log("update customer ok");
      let json = await resp.json();
      console.log(json);
	  console.log("in loginView, user is:",user)
	  const oldUser = {...user};
	  if(user.firstName !== firstName && firstName !== "")oldUser.firstName = firstName;
	  if(user.lastName !== lastName && lastName !== "")oldUser.lastName = lastName;
	 //should user be able to change email? 
	  if(user.email !== email && email !== "")oldUser.email = email;
	  if(user.address !== address && address !== "")oldUser.address = address;
	  if(user.password !== password && password !== ""){
			const basicAuthString = getBasicAuthString(email,password);
			oldUser.password = basicAuthString;
		}
	  setUser(oldUser);
    } else {
      console.log("customer update failed.");
      let json = await resp.json();
      console.log(json);
    }
  };

  return (
    <div className="login-view">
      <div className="login-wrap">
        <h2>Hej {user.firstName}</h2>
        {user && user.IsAdmin ? (
          <NavLink to="/admin">ADMIN</NavLink>
        ) : (
          <span></span>
        )}
      </div>
      <div className="add-account-wrap">
        <h2 className="ud-head-text">Uppdatera din uppgifter</h2>
        <form onSubmit={updateCustomer}>
          <input
            className="cr-account"
            type="email"
            label="Email"
            placeholder="Email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          ></input>
          <input
            className="cr-account"
            type="text"
            label="Förnamn"
            placeholder="Förnamn"
            id="firstname"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          ></input>
          <input
            className="cr-account"
            type="text"
            label="Efternamn"
            placeholder="Efternamn"
            id="lastname"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          ></input>
          <input
            className="cr-account"
            type="text"
            label="Adress"
            placeholder="Adress"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          ></input>
          <input
            className="cr-account"
            type="password"
            label="Lösenord"
            placeholder="Lösenord"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
          <button className="login-button" type="submit">
            Uppdatera
          </button>
        </form>
      </div>
    </div>
  );
}

export default UserProfileView;
