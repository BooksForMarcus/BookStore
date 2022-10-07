import { useRecoilState } from "recoil";
import booksState from "../../../atoms/booksState";
import { useState } from "react";
import loggedInUserState from "../../../atoms/loggedInUserState";
import categoriesState from "../../../atoms/categoriesState";
import { useEffect } from "react";
import AdminCategoryList from "./AdminCategoryList"
import AdminCategoryListItem from "./AdminCategoryListItem"

function AdminCategoryView() {


    const [toggle, setToggle] = useState(false);
    const [allCategories, setAllCategories] = useRecoilState(categoriesState);
 
    //const [allCategories, setAllCategories] = useState(null);
    const [name, setName] = useState("");
    const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);
    //const [toggle, setToggle] = useState(false);

    const getCategories = async () => {
        const resp = await fetch("/api/category");
        const json = await resp.json();
        json.sort((a, b) => a.name.localeCompare(b.name));
        setAllCategories(json);
        //SetToggle(!toggle);
    };

    const createThisCategory = {
        name
    }

    useEffect(() => {
        //if (allCategories === null) getCategories();
        getCategories();
    }, []);
 

    useEffect(() => {
 
        getCategories();
        console.log("toggle" + toggle);
    }, [toggle]); 
   

    const requestOptionsCreate = {
        method: "POST",
        headers: {
            Authorization: loggedInUser.password,
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(createThisCategory),
    };

    return (



        <div className="admin-category-view">
            {/*<h1>Admin Category View placeholder</h1>*/}
            <label htmlFor="CategoryName">Kategorinamn: </label>
            <input className="jonas-input3"
                width="20em"
                type="text"
                name="name"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <button className="jonas-button" onClick={() => fetch("/api/category/", requestOptionsCreate)}>Skapa Ny</button>
     

            <div className="jonas-tr">
                    <div><h3>Kategorinamn</h3></div>
                    <div></div>
                    <div><h3>Nytt namn</h3></div>
                    <div></div>
                    <div></div>
 
            </div>
            {/*<AdminCategoryList categories={allCategories} setCategories={setAllCategories} toggle={toggle} setToggle={setToggle} />*/}
            <div className="jonas-fult">
                {allCategories !== null &&
                    allCategories.map((b) => (
                        <AdminCategoryListItem key={b.id} category={b} toggle={toggle} setToggle={setToggle} />
                    ))}
                ;
            </div>
 
 
            

        </div>
    );
}

export default AdminCategoryView;
