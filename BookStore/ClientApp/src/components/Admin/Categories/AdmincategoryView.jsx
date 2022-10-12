import { useRecoilState } from "recoil";
import { useState } from "react";
import categoriesState from "../../../atoms/categoriesState";
import AdminCategoryListItem from "./AdminCategoryListItem";
import AddStuff from "./AddStuff";
import DeleteConfirm from "./DeleteConfirm";

function AdminCategoryView() {
    const [allCategories, setAllCategories] = useRecoilState(categoriesState);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [categoryToDeleteId, setCategoryToDeleteId] = useState(null);

    const getCategories = async () => {
        const resp = await fetch("/api/category");
        const json = await resp.json();
        json.sort((a, b) => a.name.localeCompare(b.name));
        setAllCategories(json);
    };
	
    return (
        <div className="admin-category-view">
		{showDeleteConfirm && <DeleteConfirm id={categoryToDeleteId} setShowDeleteConfirm={setShowDeleteConfirm} setCategoryToDeleteId={setCategoryToDeleteId}/>}
            <div className="add-stuff">
            <AddStuff allCategories={allCategories} setAllCategories={setAllCategories}  />
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
                    allCategories.map((c) => (
                        <AdminCategoryListItem key={c.id} category={c} allCategories={allCategories} setCategoryToDeleteId={setCategoryToDeleteId} setShowDeleteConfirm={setShowDeleteConfirm} setAllCategories={setAllCategories} />
                    ))}
            </div>   
        </div>
    );
}

export default AdminCategoryView;
