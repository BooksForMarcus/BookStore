import { useRecoilState } from "recoil";
import booksState from "../../../atoms/booksState";
import { useState } from "react";
import loggedInUserState from "../../../atoms/loggedInUserState";
import categoriesState from "../../../atoms/categoriesState";
import { useEffect } from "react";
import AdminCategoryList from "./AdminCategoryList"

function AdminCategoryView() {


    const [toggle, SetToggle] = useState(false);
    const [allCategories, setAllCategories] = useRecoilState(categoriesState);
    const [name, setName] = useState("");
    const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);

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
        //Runs on the first render
        //And any time any dependency value changes
        getCategories();
    }, [allCategories]);//loop 8..?

   

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
            <AdminCategoryList categories={allCategories} setCategories={setAllCategories} />
 
 
            

        </div>
    );
}

export default AdminCategoryView;
