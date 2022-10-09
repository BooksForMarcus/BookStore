import { useRecoilState } from "recoil";
import { useState } from "react";
import categoriesState from "../../../atoms/categoriesState";
import { useEffect } from "react";
import AdminCategoryListItem from "./AdminCategoryListItem";
import AddStuff from "./AddStuff";

function AdminCategoryView() {
    const [toggle, setToggle] = useState(false);
    const [allCategories, setAllCategories] = useRecoilState(categoriesState);

    const getCategories = async () => {
        const resp = await fetch("/api/category");
        const json = await resp.json();
        json.sort((a, b) => a.name.localeCompare(b.name));
        setAllCategories(json);
    };

    useEffect(() => {
 
        setTimeout(() => {
            getCategories();
            console.log("tock");
        }, 100);
    });

    return (
        <div className="admin-category-view">
            <div className="add-stuff">
            <AddStuff allCategories={allCategories} setAllCategories={setAllCategories} toggle={toggle} setToggle={setToggle} />
            </div>
                <div className="jonas-tr-h">
 
                    <div><h3>Kategorinamn</h3></div>
                    <div></div>
                    <div><h3>Nytt namn</h3></div>
                    <div></div>
                    <div></div>
            </div>

             <div className="jonas-fult">
                {allCategories !== null &&
                    allCategories.map((b) => (
                        <AdminCategoryListItem key={b.id} category={b} toggle={toggle} setToggle={setToggle}  setAllCategories={setAllCategories} />
                    ))}
            </div>   
        </div>
    );
}

export default AdminCategoryView;
