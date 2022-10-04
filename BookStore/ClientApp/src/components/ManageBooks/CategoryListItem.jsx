import { useState } from "react";

const CategoryListItem = ({ category, categories, setCategories }) => {
    const [checked, setChecked] = useState(
        categories.some((c) => c === category.id)
    );

    const updateBook = () => {
        if (checked) {
            setCategories(categories.filter((c) => c !== category.id));
        } else {
            setCategories([...categories, category.id]);
        }
        setChecked(!checked);
        console.log(categories);
    };

  return (
    <div className="category-list-item" key={category.id}>
      <input
        type="checkbox"
        checked={checked}
        onChange={updateBook}
        name={category.name}
        id={category.name}
      />
      <label htmlFor={category.name}>{category.name}</label>
    </div>
  );
};

export default CategoryListItem;
