import React, { useState, useEffect } from "react";
import "../App.css";
import { useLocation } from "react-router-dom";
import BookDetails from "../components/Books/BookDetails";
function BookView() {
  const loc = useLocation();

  var bookdata = loc.state;
  const [book, setBook] = useState(null);
  var bookId = window.location.pathname.split("/").pop();

  const getBook = async () => {
    const resp = await fetch(`/api/Book/${bookId}`);
    const json = await resp.json();
    setBook(json);
  };

  useEffect(() => {
    if (book === null || book.id !== bookId) {
      if (bookdata !== null) setBook(bookdata);
      else getBook();
    }
  }, []);

  return (
    <div className="main-container">
      <div className="side"></div>
      {book !== null ? <BookDetails book={book} /> : <span>Loading...</span>}
    </div>
  );
}

export default BookView;
