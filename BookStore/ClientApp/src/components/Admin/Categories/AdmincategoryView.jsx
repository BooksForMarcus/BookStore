import { useRecoilState } from "recoil";
import booksState from "../../../atoms/booksState";
import { useState } from "react";
import loggedInUserState from "../../../atoms/loggedInUserState";
import categoriesState from "../../../atoms/categoriesState";
import { useEffect } from "react";
import AdminCategoryList from "./AdminCategoryList"

function AdminCategoryView() {


  
    const [allCategories, setAllCategories] = useRecoilState(categoriesState);
    const [name, setName] = useState("");
    const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);
 
    const createThisCategory = {
        name
    }

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
            <h1>Admin Category View placeholder</h1>
            <label htmlFor="CategoryName">Kategorinamn</label>
            <input
                type="text"
                name="name"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <button onClick={() => fetch("/api/category/", requestOptionsCreate)}>Create</button>
            <AdminCategoryList categories={allCategories} />
 
 
            

        </div>
    );
}

export default AdminCategoryView;
