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

function App() {
    const [count, setCount] = useState(0);


    return (
        <BrowserRouter>
            <div className="App">
                    <header>
                            <div className="navbar">
                                <Link className="menu-item" to="/">Home</Link>
                                <Link className="menu-item" to="/admin">Admin</Link>
                                <Link className="menu-item" to="/login">Logga in</Link>
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