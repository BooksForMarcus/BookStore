import React from "react";
import { useState } from "react";
import "../App.css";
import "../components/Login/LoginView.css";
import emailcheck from "../assets/email-transparent-icon-17.png";
import { useRecoilState } from "recoil";
import loggedInUserState from "../atoms/loggedInUserState";
import { decode as base64_decode, encode as base64_encode } from "base-64";
import { useNavigate } from "react-router-dom";
import LoginInViewOverLay from "../components/Login/LoginViewOverlay";
import ForgottenPasswordModal from "../components/Login/ForgottenPasswordModal";
import { useEffect } from "react";

function LoginView() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailCreate, setEmailCreate] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userCreated, setUserCreated] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useRecoilState(loggedInUserState);
  const [loginError, setLoginError] = useState(null);
  const [creationError, setCreationError] = useState(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

 useEffect(() => {
	if (localStorage.getItem("user") !== null) {
	  navigate("/profile");
	}
 },[user]); 
 
  const createNewCustomer = async (e) => {
    e.preventDefault();

    const newUser = JSON.stringify({
      email: emailCreate,
      firstName: firstName,
      lastName: lastName,
    });
    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: newUser,
    };
    //let json = null;
    let resp = await fetch("/api/customer/", requestOptions);
    if (resp.ok) {
      setUserCreated(true);
      let json = await resp.json();
      console.log(json);
    } else {
      console.log("customer create failed.");
      let json = await resp.json();
      console.log(json);
      setCreationError(json);
    }
  };

  const newDoLogin = async (e) => {
    e.preventDefault();

    const baseString = email + ":" + password;
    const base64basicAuth = base64_encode(baseString);

    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: "Basic " + base64basicAuth,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    let resp = await fetch("/api/customer/login", requestOptions);
    if (resp.ok) {
      let json = await resp.json();
      if (json.success) {
        json.user.password = "Basic " + base64basicAuth;
        setUser(json.user);
		localStorage.setItem("user", JSON.stringify(json.user));
        navigate("/profile");
      } else {
        setLoginError(json);
      }
    }
  };
  const errorState = {
    loginError,
    setLoginError,
    creationError,
    setCreationError,
  };

  return (
    <div className="login-view">
      {showForgotPassword === true && <ForgottenPasswordModal setShowForgotPassword={setShowForgotPassword}/>}
      {(loginError || creationError) && (
        <LoginInViewOverLay errorState={errorState} />
      )}
      <div className="login-wrap">
        <h2>Logga in</h2>
        <form onSubmit={newDoLogin}>
        <label htmlFor="email">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            id="email"
            className="red-input"
            required
          ></input>
          <span className="red-fl-label">Email</span>
          </label>
          <label htmlFor="password">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Lösenord"
            id="password"
            className="red-input"
            required
          ></input>
          <span className="red-fl-label">Lösenord</span>
          </label>
          <button className="login-button" type="submit">
            Logga in
          </button>
          <span className="login-forgott-password" onClick={() => setShowForgotPassword(true)}>
            Glömt lösenord
          </span>
        </form>
      </div>
      {!userCreated ? (
        <div className="add-account-wrap">
          <h2 className="cr-head-text">Skapa konto</h2>
          <form onSubmit={createNewCustomer}>
          <label htmlFor="email">
            <input
              className="cr-account"
              type="email"
              placeholder="Email"
              id="emailCreate"
              value={emailCreate}
              onChange={(e) => setEmailCreate(e.target.value)}
              required
            ></input>
            <span className="fl-label">Email</span>
            </label>
            <label htmlFor="firstname">
            <input
              className="cr-account"
              type="text"
              placeholder="Förnamn"
              id="firstname"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            ></input>
            <span className="fl-label">Förnamn</span>
            </label>
            <label htmlFor="lastname">
            <input
              className="cr-account"
              type="text"
              placeholder="Efternamn"
              id="lastname"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            ></input>
            <span className="fl-label">Efternamn</span>
            </label>
            <button className="login-button" type="submit">
              {/*onClick={createNewCustomer} disabled={firstName === null ||firstName.length === 0}*/}
              Skapa konto
            </button>
          </form>
        </div>
      ) : (
        <div className="add-account-resp-wrap">
          <h2 className="cr-resp-head-text">Välkommen {firstName}!</h2>
          <img src={emailcheck} className="cr-resp-img" />
          <p className="cr-resp-text">
            Vi har skickat ditt lösenord till {emailCreate}.
          </p>
        </div>
      )}
    </div>
  );
}

export default LoginView;
