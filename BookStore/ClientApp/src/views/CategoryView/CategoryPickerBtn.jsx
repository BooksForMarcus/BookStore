import "./CategoryView.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars,faPlus } from "@fortawesome/free-solid-svg-icons";
import { useRecoilValue } from "recoil";
import categoriesState from "../../atoms/categoriesState";
import CategoryPickerListItem from "./CategoryPickerListItem";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const CategoryPickerBtn = ({ currentCategory, setCurrentCategory }) => {
  const allCategories = useRecoilValue(categoriesState);
  const [showCategories, setShowCategories] = useState(false);
  const loc = useLocation();

  useEffect(() => {
	if (loc.pathname === "/category" && currentCategory !== "all") {
		setCurrentCategory("all");
	}
	else if (loc.pathname.slice(0,10)=== "/category/" && currentCategory !== loc.pathname.split("/").pop()) {
		setCurrentCategory(loc.pathname.split("/").pop());
	}
  }, [loc]);

  return (
    <div className="admin-book-edit-category-area">
      <button
        type="button"
        onClick={() => setShowCategories(!showCategories)}
        className={showCategories ? "category-picker-btn category-picker-btn-active": "category-picker-btn"}
      >
        {showCategories ?<FontAwesomeIcon icon={faPlus} />:<FontAwesomeIcon icon={faBars} />} KATEGORIER
      </button>
      {showCategories && (
        <div className="category-picker-list">
		
          <CategoryPickerListItem
            category={{ id: "all", name: "Alla" }}
            currentCategory={currentCategory}
            setCurrentCategory={setCurrentCategory}
            setShowCategories={setShowCategories}
          />
          {allCategories.map((category) => (
            <CategoryPickerListItem
              key={"cpli-" + category.id}
              category={category}
              currentCategory={currentCategory}
              setCurrentCategory={setCurrentCategory}
              setShowCategories={setShowCategories}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPickerBtn;
