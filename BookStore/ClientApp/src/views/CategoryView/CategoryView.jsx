import { useState, useEffect } from "react";
import "../../App";
import { useRecoilValue } from "recoil";
import categoriesState from "../../atoms/categoriesState";
import booksState from "../../atoms/booksState";

function CategoryView() {
  const getCategories = useRecoilValue(categoriesState);
  const [category, setCategory] = useState("all");
  const books = useRecoilValue(booksState);
  const [filteredBooks, setFilteredBooks] = useState(null);

  useEffect(() => {
    let newBooks;
    if (books !== null) {
      if (category === "all") {
        newBooks = books;
      } else {
        newBooks = books.filter((b) =>
          b.categories.some((c) => c === category)
        );
      }
      setFilteredBooks(newBooks);
    }
  }, [category,books]);

  return (
    <div>
      {getCategories !== null ? (
        <div>
          <h3>Categories</h3>
          <select
            name="categories"
            id=""
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value={"all"}>Alla</option>
            {getCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <h1>Loading...</h1>
      )}
      {filteredBooks !== null &&
        filteredBooks.map((book) => (
          <div key={book.id}>
            <h5>{book.title}</h5>
          </div>
        ))}
    </div>
  );
}

export default CategoryView;
