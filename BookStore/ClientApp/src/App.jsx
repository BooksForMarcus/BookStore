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
import BookView from "./views/BookView";
import logo from './assets/boklogo.png'
import {useRecoilState} from "recoil"
import Search from "./components/Search/BookSearch"
import UserProfileView from "./views/UserProfileView";
import loggedInUserState from "./atoms/loggedInUserState";
import SearchResults from "./components/Search/SearchResults";
import BookResult from "./components/Search/BookResult";
import { useEffect } from "react";
import booksState from "./atoms/booksState";
import categoriesState from "./atoms/categoriesState";

function App() {
	const [user, setUser] = useRecoilState(loggedInUserState);
	const [books, setBooks] = useRecoilState(booksState);
	const [showSearch,setShowSearch] = useState(false);
	const [categories, setCategories] = useRecoilState(categoriesState);
	
	const getBooks = async () => {
		const resp = await fetch("/api/Book");
		const json = await resp.json();
		json.sort((a,b) => a.title.localeCompare(b.title));
		setBooks(json);
	};
	const getCategories = async () => {
		const resp = await fetch("/api/category");
		const json = await resp.json();
		json.sort((a,b) => a.name.localeCompare(b.name));
		setCategories(json);
	};

	useEffect(() => {
		if(books === null) getBooks();
		if(categories === null) getCategories();
	}, []);

    return (
        <BrowserRouter>
            <div className="App">
                <header>
                    <NavLink className="nav_logo" to="/"><img className="nav_logo" src={logo} alt="An image of bookstore logo" /></NavLink>
                    <div className="navbar">
                        <div className="menu-item" >
                            <NavLink to="/" className="menu-link">HEM</NavLink>
                        </div>
                        <div className="menu-item" >
                            <NavLink to="/">KATEGORIER</NavLink>
                        </div>
                        <div className="menu-item" >
                            <span className="nav-item-search" to="/" onClick={()=>setShowSearch(true)}>SÖK</span>
                            {/* <div className="nav-modal">
                                <div className="searchBar"><Search /></div>
                            </div> */}
                        </div>
                        <div className="menu-item" >
                            {user ? <NavLink to="/profile">MIN SIDA</NavLink> : <NavLink to="/login">LOGGA IN</NavLink>}
                        </div>
                    </div>
                </header>
                <main>
                    {showSearch && <div className="searchBar"><Search /></div>}
                    <Routes>
                        <Route path='/' element={<HomeView />} />
                        <Route path='/admin' element={<AdminView user={user}/>} />
                        <Route path='/login' element={<LoginView />} />
                        <Route path='/profile' element={<UserProfileView />} />
                        <Route path='/search_result' element={<SearchResults />} />
                        <Route path='/search_book' element={<BookResult />} />
                        <Route path='/book/:bookid' element={<BookView />} />

                    </Routes>
                </main>
                <footer>
                    {user && user.isAdmin ? <NavLink to="/admin">ADMIN</NavLink> : <span></span>}
                </footer>
            </div>
        </BrowserRouter>
    );
}

export default App;