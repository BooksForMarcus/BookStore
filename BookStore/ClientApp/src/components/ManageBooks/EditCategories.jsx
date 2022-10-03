import "../Admin/admin.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useRecoilState } from "recoil";
import categoriesState from "../../atoms/categoriesState";
import CategoryListItem from "./CategoryListItem";
import { useState } from "react";

const EditCategories = ({categories,setCategories}) => {
	const [allCategories, setAllCategories] = useRecoilState(categoriesState);
	const [showCategories, setShowCategories] = useState(false);


	return ( 
		<div className="admin-book-edit-category-area">
          <button
            type="button"
            onClick={() => setShowCategories(!showCategories)}
          >
            <FontAwesomeIcon icon={faBars} /> Kategorier
          </button>
          {showCategories && (
            <div className="admin-book-edit-categories-list">
              {allCategories.map((category) => (
                <CategoryListItem
				  key={"admin" + category.id}
                  category={category}
                  categories={categories}
                  setCategories={setCategories}
                />
              ))}
            </div>
          )}
        </div>
	 );
}

export default EditCategories;