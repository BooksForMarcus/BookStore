import { useState, useEffect } from "react";
import "../../App.css";
import "./addBook.css";
import { useRecoilState } from "recoil";
import loggedInUserState from "../../atoms/loggedInUserState";
import getBasicAuthString from "../../getBasicAuthString";
import ModalBaseFull from "../Modal/ModalBaseFull";
import EditCategories from "../ManageBooks/EditCategories";
import booksState from "../../atoms/booksState";

const BookCrud = ({ isEdit, book, setBookToEdit }) => {
  const [books, setBooks] = useRecoilState(booksState);
  const bookId = isEdit ? book.id : "";
  const [user, setUser] = useRecoilState(loggedInUserState);
  const [isbn, setIsbn] = useState(isEdit ? book.isbn : "");
  const [author, setAuthor] = useState(isEdit ? book.author : "");
  const [title, setTitle] = useState(isEdit ? book.title : "");
  const [language, setLanguage] = useState(isEdit ? book.language : "");
  const [categories, setCategories] = useState(isEdit ? book.categories : []);
  const [numInstock, setNumInstock] = useState(isEdit ? book.numInstock : 0);
  const [price, setPrice] = useState(isEdit ? book.price : 0);
  const [year, setYear] = useState(isEdit ? book.year : 0);
  const [imageURL, setImageURL] = useState(isEdit ? book.imageURL : "");
  const [pages, setPages] = useState(isEdit ? book.pages : 0);
  const [weight, setWeight] = useState(isEdit ? book.weight : 0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showBookCreated, setShowBookCreated] = useState(false);
  const [bookCreated, setBookCreated] = useState(false);
  const [bookCreateError, setBookCreateError] = useState(null);
  const bookSoldById = isEdit
    ? book.soldById
    : user.isAdmin
    ? "store"
    : user.id;

  const buildBook = () => {
    return {
      id: bookId,
      isbn,
      author,
      title,
      language,
      categories,
      numInstock,
      price,
      year,
      imageURL,
      pages,
      weight,
      soldById: bookSoldById,
    };
  };

  const addBook = async (e) => {
    e.preventDefault();

    const newBook = buildBook();

    console.log(newBook);
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: user.password,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newBook)
    };

    let resp = await fetch("/api/Book/", requestOptions);
    if (resp.ok) {
      console.log("Book created");
      setBookCreated(true);
	  setBooks([...books, newBook].sort((a, b) => a.title.localeCompare(b.title)));
      let json = await resp.json();
      console.log(json);
    } else {
      console.log("Book create failed.");
      let json = await resp.json();
      console.log(json);
      setBookCreateError(json);
    }
  };

  const updateBook = async (e) => {
    e.preventDefault();
    const updatedBook = buildBook();
    const requestOptions = {
      method: "PUT",
      headers: {
        Authorization: user.password,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedBook)
    };

    let resp = await fetch("/api/book", requestOptions);
    if (resp.ok) {
      let json = await resp.json();
      //setUpdateOk(true);
      var newBooks = books.filter((b) => b.id !== updatedBook.id);
      newBooks.push(updatedBook);
      newBooks.sort((a, b) => a.title.localeCompare(b.title));
      setBooks(newBooks);
    } else {
      //setUpdateOk(false);
    }
  };

  return (
    <div>
      <form className="add-book-wrap" onSubmit={isEdit ? updateBook : addBook}>
		<input
          className="cr-book-title"
          type="text"
          label="Boktitel"
          placeholder="Boktitel"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        ></input>
        <div className="cr-container-1">
          <input
            className="cr-book"
            type="text"
            label="Författare"
            placeholder="Författare"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          ></input>
          <input
            className="cr-book"
            type="text"
            label="ISBN"
            placeholder="ISBN"
            id="isbn"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            required
          ></input>
          <input
            className="cr-book"
            type="url"
            label="Bildlänk (URL)"
            placeholder="Bildlänk (URL)"
            id="imageURL"
            value={imageURL}
            onChange={(e) => setImageURL(e.target.value)}
          ></input>
          <input
            className="cr-book"
            type="text"
            label="Språk"
            placeholder="Språk"
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          ></input>
        </div>
        <div className="cr-container-2">
          <EditCategories
            categories={categories}
            setCategories={setCategories}
          />
          <input
            className="cr-book"
            type="number"
            label="Utgivningsår"
            placeholder="Utgivningsår"
            id="year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          ></input>
          <input
            className="cr-book"
            type="number"
            label="Antal sidor"
            placeholder="Antal sidor"
            id="pages"
            value={pages}
            onChange={(e) => setPages(e.target.value)}
          ></input>
          <input
            className="cr-book"
            type="number"
            label="Vikt (gram)"
            placeholder="Vikt (gram)"
            id="weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          ></input>
          <input
            className="cr-book"
            type="number"
            label="Antal"
            placeholder="Antal"
            id="numInstock"
            value={numInstock}
            onChange={(e) => setNumInstock(e.target.value)}
          ></input>
          <input
            className="cr-book"
            type="number"
            label="Pris"
            placeholder="Pris"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          ></input>
        </div>
        <button type="submit" onClick={() => setShowBookCreated(true)}>
          {isEdit ? "Uppdatera bok" : "Lägg upp bok"}
        </button>
        {isEdit && (
          <button type="button" onClick={() => setBookToEdit(null)}>
            Stäng
          </button>
        )}
        {isEdit && (
          <button type="button" onClick={() => setShowDeleteConfirm(true)}>
            Ta bort bok
          </button>
        )}
      </form>
    </div>
  );
};

export default BookCrud;
