import React from 'react'
import "../App.css";

function LoginView() {
    return (
            <div className="login-view">
                <div className="login-wrap">
                    <h2>Logga in</h2>
                    <form>
                        <input type="email" label="Email" placeholder="Email" id="email"></input>
                        <input type="password" label="Lösenord" placeholder="Lösenord" id="password"></input>
                        <button className="login-button" type="submit">Logga in</button>
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