import { useState } from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    NavLink
} from "react-router-dom";
import "./App.css";
import HomeView from "./views/HomeView";
import AdminView from "./views/AdminHomeView";
import LoginView from "./views/LoginView";
import logo from './assets/boklogo.png'
import {useRecoilState} from "recoil"
import userState from "./atoms/userState";
import UserProfileView from "./views/UserProfileView";

function App() {
	const [user] = useRecoilState(userState);

    return (
        <BrowserRouter>
            <div className="App">
                <header>
                    <img className="nav_logo" src={logo} alt="An image of bookstore logo" />
                    <div className="navbar">
                        <div className="menu-item" >
                            <NavLink to="/" className="menu-link">HEM</NavLink>
                        </div>
                        <div className="menu-item" >
                            {user ? <NavLink to="/profile">MIN SIDA</NavLink> : <NavLink to="/login">LOGGA IN</NavLink> }
                        </div>
                    </div>
                </header>
                <Routes>
                    <Route path='/' element={<HomeView />} />
                    <Route path='/admin' element={<AdminView />} />
                    <Route path='/login' element={<LoginView />} />
                    <Route path='/profile' element={<UserProfileView />} />
                </Routes>
                <footer>
                    {user && user.isAdmin ? <NavLink to="/admin">ADMIN</NavLink> : <span></span>}
                </footer>
            </div>
        </BrowserRouter>
    );
}

export default App;