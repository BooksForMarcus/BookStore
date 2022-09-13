import React from 'react'
import { useState } from 'react';
import "../App.css";
import {useRecoilState} from 'recoil'

function LoginView() {
	const [email,setEmail] = useState("");
	const [password,setPassword] = useState("");


	const doLogin = async (e) => {
		e.preventDefault();

		const newUser = JSON.stringify({  email: email, password: password })
		console.log(newUser)
		const requestOptions = {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: newUser
		};
		let json = null;
		fetch("/api/customer/login", requestOptions)
			.then((response) => {
				console.log(response)
				if (response.status === 400) {
					// console.log("status is 400")
					//setSuccessfulSignUp(false)
					//setInfoMessage("Could not sign up using the chosen username / email")
					console.log("login failed")
				}
				if (response.status === 200) {
					// console.log("status is 200")
					//setSuccessfulSignUp(true)
					//setInfoMessage("Succesfully signed up!")
					//resetTextFields()
					console.log("login ok")
				}
			})
	};


    return (
            <div className="login-view">
                <div className="login-wrap">
                    <h2>Logga in</h2>
                    <form>
                        <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} label="Email" placeholder="Email" id="email"></input>
						<p>{email}</p>
                        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} label="Lösenord" placeholder="Lösenord" id="password"></input>
                        <button className="login-button" type="submit" onClick={doLogin}>Logga in</button>
                    </form>
                </div>
                <div className="add-account-wrap">
                    <h2 className="cr-head-text">Skapa konto</h2>
                    <form>
                        <input className="cr-account" type="email" label="Email" placeholder="Email" id="email" required></input>
                        <input className="cr-account" type="text" label="Förnamn" placeholder="Förnamn" id="firstname" required></input>
                        <input className="cr-account" type="text" label="Efternamn" placeholder="Efternamn" id="lastname" required></input>
                        <button className="login-button" type="submit">Skapa konto</button>
                    </form>
                </div>
            </div>
    );
}

export default LoginView;