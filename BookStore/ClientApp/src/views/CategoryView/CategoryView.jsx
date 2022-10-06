import { useState, useEffect } from "react";
import "./CategoryView.css";
import { useRecoilValue } from "recoil";
import categoriesState from "../../atoms/categoriesState";
import booksState from "../../atoms/booksState";
import { Link } from "react-router-dom";

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
      <div className="card-category-items">
      {filteredBooks !== null &&
        filteredBooks.map((book) => (
            <Link className="card-category-items-link"
                  key={book.id}
                  to={`/book/${book.id}`}
                  state={book}>
              <img
                    className="book-img"
                    src={book.imageURL}
                    alt="Front image of book"
                    >
                    </img>
             <h5>{book.title}</h5>
            </Link>
        ))}
        </div>
    </div>
  );
}

export default CategoryView;
