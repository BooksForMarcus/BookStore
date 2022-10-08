import { useState, useEffect } from "react";
import "./CategoryView.css";
import { useRecoilValue } from "recoil";
import categoriesState from "../../atoms/categoriesState";
import booksState from "../../atoms/booksState";
import { NavLink } from "react-router-dom";
import BookCard from "../../components/Books/BookCard";

function CategoryView({ currentCategory }) {
  const allCategories = useRecoilValue(categoriesState);
  const allBooks = useRecoilValue(booksState);
  const [filteredBooks, setFilteredBooks] = useState(null);

  if (allBooks !== null && allCategories !== null && filteredBooks === null) {
    let newBooks = [];
    if (currentCategory === "all") {
      newBooks = allBooks.filter(
        (b) => b.soldById === "store" || b.numInstock > 0
      );
    } else {
      newBooks = allBooks.filter((b) =>
        b.categories.some(
          (c) =>
            c === currentCategory &&
            (b.soldById === "store" || b.numInstock > 0)
        )
      );
    }
    setFilteredBooks(newBooks);
  }

  useEffect(() => {
    if (allBooks !== null && allCategories !== null) {
      let newBooks = [];
      if (currentCategory === "all") {
        newBooks = allBooks.filter(
          (b) => b.soldById === "store" || b.numInstock > 0
        );
      } else {
        newBooks = allBooks.filter((b) =>
          b.categories.some(
            (c) =>
              c === currentCategory &&
              (b.soldById === "store" || b.numInstock > 0)
          )
        );
      }
      setFilteredBooks(newBooks);
    }
  }, [currentCategory]);

  return (
    <div className="category-view-container">
      <div className="side category-side">
        {allCategories !== null && (
          <div className="category-list">
            <h3>Kategorier:</h3>
            <ul>
              <NavLink to="/category/all" className="category-side-link" key={"cat-all"}>
                <li>Alla</li>
              </NavLink>
              {allCategories.map((c) => (
                <NavLink
                  key={"cat-" + c.id}
                  to={"/category/" + c.id}
                  className="category-side-link"
                >
                  <li key={"catli"+c.id}>{c.name}</li>
                </NavLink>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="category-cards-container">
        {filteredBooks !== null && filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <div className="category-card" key={book.id}>
              <BookCard book={book}  />
            </div>
          ))
        ) : (
          <h1>Inga böcker i denna kategori</h1>
        )}
      </div>
    </div>
  );
}

export default CategoryView;
