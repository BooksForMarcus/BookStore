import { useRecoilState } from "recoil";
import booksState from "../../../atoms/booksState";
import { useState } from "react";
import loggedInUserState from "../../../atoms/loggedInUserState";
import categoriesState from "../../../atoms/categoriesState";
import { useEffect } from "react";
import AdminCategoryList from "./AdminCategoryList";
import AdminCategoryListItem from "./AdminCategoryListItem";
import AddStuff from "./AddStuff";

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
        if (allCategories === null) getCategories();
        //getCategories();
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

    async function blah() {
        setToggle(!toggle);
        const resp = await fetch("/api/category");
        const json = await resp.json();
        json.sort((a, b) => a.name.localeCompare(b.name));
        setAllCategories(json);
        console.log("blah");
    }

    const handleClick2 = (event, param) => {
        setToggle(!toggle);
        console.log(event);
        console.log("param" + param + "cr"+ createThisCategory);
        fetch('/api/category/',
            {
                method: "POST",
                headers: {
                    Authorization: loggedInUser.password,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(  createThisCategory  ),
            }).then(blah());
        setToggle(!toggle);
        //console.log("error ");
        //refresh();
    };

    return (



        <div className="admin-category-view">
            {/*<h1>Admin Category View placeholder</h1>*/}
            {/*<label htmlFor="CategoryName">Kategorinamn: </label>*/}
            {/*<input className="jonas-input3"*/}
            {/*    width="20em"*/}
            {/*    type="text"*/}
            {/*    name="name"*/}
            {/*    id="name"*/}
            {/*    value={name}*/}
            {/*    onChange={(e) => setName(e.target.value)}*/}
            {/*/>*/}
            {/*<button className="jonas-button" onClick={() => fetch("/api/category/", requestOptionsCreate)}>Skapa Ny</button>*/}
            <AddStuff allCategories={allCategories} setAllCategories={setAllCategories} toggle={toggle} setToggle={setToggle} />
           {/* <button className="jonas-button" onClick={ (event => handleClick2(event, name))}>Skapa Ny</button>*/}
     

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
                        <AdminCategoryListItem key={b.id} category={b} toggle={toggle} setToggle={setToggle}  setAllCategories={setAllCategories} />
                    ))}
                ;
            </div>
 
 
            

        </div>
    );
}

export default AdminCategoryView;
