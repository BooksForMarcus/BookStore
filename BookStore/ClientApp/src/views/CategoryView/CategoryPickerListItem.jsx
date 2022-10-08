import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const CategoryPickerListItem = ({
  category,
  setShowCategories,
}) => {
  const hide = () => setShowCategories(false);

  return (
    <div className="category-picker-list-item" key={category.id}>
      <NavLink to={"/category/" + category.id} onClick={hide}>
        {category.name}
      </NavLink>
    </div>
  );
};

export default CategoryPickerListItem;
