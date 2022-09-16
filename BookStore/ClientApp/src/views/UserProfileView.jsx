import React from "react";
import {
    NavLink
} from "react-router-dom";
import { useState } from "react";
import "../App.css";
import { useRecoilState } from "recoil";
import userState from "../atoms/userState";

function UserProfileView() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [user] = useRecoilState(userState);

  const updateCustomer = async (e) => {
    e.preventDefault();

    const newUser = JSON.stringify({ email: email, firstName: firstName, lastName: lastName, password: password, address: address });
    console.log(newUser);
    const requestOptions = {
      method: "PUT",
      headers: {
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
        {user && user.IsAdmin ? <NavLink to="/admin">ADMIN</NavLink> : <span></span>}
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
            required
          ></input>
          <button className="login-button" type="submit" >
            Uppdatera
          </button>
        </form>
      </div>
    </div>
  );
}

export default UserProfileView;
