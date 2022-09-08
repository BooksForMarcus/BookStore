import { useState } from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    Link
} from "react-router-dom";
import "./App.css";
import HomeView from "./views/HomeView";
import AdminView from "./views/AdminHomeView";
import LoginView from "./views/LoginView";
import logo from './assets/boklogo.png'

function App() {
    const [count, setCount] = useState(0);


    return (
        <BrowserRouter>
            <div className="App">
                <header>
                    <img className="nav_logo" src={logo} alt="An image of bookstore logo" />
                    <div className="navbar">
                        <div className="menu-item" >
                            <Link to="/">HEM</Link>
                        </div>
                        <div className="menu-item" >
                            <Link to="/admin">ADMIN</Link>
                        </div>
                        <div className="menu-item" >
                            <Link to="/login">LOGGA IN</Link>
                        </div>
                    </div>
                </header>
                <Routes>
                    <Route path='/' element={<HomeView />} />
                    <Route path='/admin' element={<AdminView />} />
                    <Route path='/login' element={<LoginView />} />
                </Routes>
                <footer>
                    {/*<button onClick={() => setCount((count) => count + 1)}>*/}
                    {/*    count is {count}*/}
                    {/*</button>*/}
                </footer>
            </div>
        </BrowserRouter>
    );
}

export default App;