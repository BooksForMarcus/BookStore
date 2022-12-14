import { useState, useEffect } from "react";
import "../../App.css";
import "./addBook.css";
import { useRecoilState } from "recoil";
import loggedInUserState from "../../atoms/loggedInUserState";
import getBasicAuthString from "../../getBasicAuthString";
import ModalBaseFull from "../Modal/ModalBaseFull";
import EditCategories from "../ManageBooks/EditCategories";
import booksState from "../../atoms/booksState";
import { useNavigate } from "react-router-dom";
import BookUpdatedModal from "./BookUpdatedModal";
import BookAddedModal from "./BookAddedModal";
import BookDeleteConfirmModal from "./BookDeleteConfirmModal";

const BookCrud = ({ isEdit, book, setBookToEdit }) => {
  const [books, setBooks] = useRecoilState(booksState);
  let bookId = isEdit === true && book!==undefined ? book.id : "";
  const [user, setUser] = useRecoilState(loggedInUserState);
  const [isbn, setIsbn] = useState(isEdit && book!==undefined ? book.isbn : "");
  const [author, setAuthor] = useState(isEdit && book!==undefined ? book.author : "");
  const [title, setTitle] = useState(isEdit && book!==undefined ? book.title : "");
  const [language, setLanguage] = useState(isEdit && book!==undefined ? book.language : "");
  const [categories, setCategories] = useState(isEdit && book!==undefined ? book.categories : []);
  const [numInstock, setNumInstock] = useState(isEdit && book!==undefined ? book.numInstock : 0);
  const [price, setPrice] = useState(isEdit && book!==undefined ? book.price : 0);
  const [year, setYear] = useState(isEdit && book!==undefined ? book.year : 0);
  const [imageURL, setImageURL] = useState(isEdit && book!==undefined ? book.imageURL : "");
  const [pages, setPages] = useState(isEdit && book!==undefined ? book.pages : 0);
  const [weight, setWeight] = useState(isEdit && book!==undefined ? book.weight : 0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [bookCreated, setBookCreated] = useState(null);
  const [bookUpdated, setBookUpdated] = useState(null);
  const navigate = useNavigate();
  let bookSoldById =
    user !== null && isEdit && book!==undefined
      ? book.soldById
      : user !== null && user.isAdmin
      ? "store"
      : user !== null
      ? user.id
      : null;

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
  useEffect(() => {
    bookId = isEdit && book!==undefined ? book.id : "";
    setIsbn(isEdit && book!==undefined ? book.isbn : "");
    setAuthor(isEdit && book!==undefined ? book.author : "");
    setTitle(isEdit && book!==undefined ? book.title : "");
    setLanguage(isEdit && book!==undefined ? book.language : "");
    setCategories(isEdit && book!==undefined ? book.categories : []);
    setNumInstock(isEdit && book!==undefined ? book.numInstock : 0);
    setPrice(isEdit && book!==undefined ? book.price : 0);
    setYear(isEdit && book!==undefined ? book.year : 0);
    setImageURL(isEdit && book!==undefined ? book.imageURL : "");
    setPages(isEdit && book!==undefined ? book.pages : 0);
    setWeight(isEdit && book!==undefined ? book.weight : 0);
    bookSoldById = isEdit && book!==undefined ? book.soldById : user.isAdmin ? "store" : user.id;
  }, [book]);

  useEffect(() => {
    if (user === null) {
      navigate("/login");
    }
  }, [user]);

  const addBook = async (e) => {
    e.preventDefault();

    const newBook = buildBook();
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: user.password,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newBook),
    };

    let resp = await fetch("/api/Book/", requestOptions);
    if (resp.ok) {
      console.log("Book created");
      setBookCreated("ok");
      let json = await resp.json();
      newBook.id = json;
      setBooks(
        [...books, newBook].sort((a, b) => a.title.localeCompare(b.title))
      );
    } else {
      console.log("Book create failed.");
      let json = await resp.json();
      console.log(json);
      setBookCreated("fail");
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
      body: JSON.stringify(updatedBook),
    };

    let resp = await fetch("/api/book", requestOptions);
    if (resp.ok) {
	  console.log("Book updated");
      let json = await resp.json();
      //setUpdateOk(true);
      var newBooks = books.filter((b) => b.id !== updatedBook.id);
      newBooks.push(updatedBook);
      newBooks.sort((a, b) => a.title.localeCompare(b.title));
      setBooks(newBooks);
	  setBookUpdated("ok");
    } else {
		setBookUpdated("fail");
      //setUpdateOk(false);
    }
  };
  const deleteBook = async (e) => {
    const bookToDelete = buildBook();
    const requestOptions = {
      method: "DELETE",
      headers: {
        Authorization: user.password,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookToDelete),
    };
    let resp = await fetch("/api/book/", requestOptions);
    if (resp.ok) {
      let newBooks = books.filter((b) => b.id !== bookToDelete.id);
      setBooks(newBooks);
      setBookToEdit(null);
	  isEdit = false;
    }
  };

  return (
    <div className="book-crud-container">
      {showDeleteConfirm && (
        <BookDeleteConfirmModal deleteBook={deleteBook} setShowDeleteConfirm={setShowDeleteConfirm}/>
      )}
      {bookCreated != null && (
        <BookAddedModal bookCreated={bookCreated} setBookCreated={setBookCreated}/>
      )}
	  {bookUpdated != null && (
		<BookUpdatedModal bookUpdated={bookUpdated} setBookUpdated={setBookUpdated}/>
      )}

      <form className="add-book-wrap" onSubmit={isEdit ? updateBook : addBook}>
        <label htmlFor="title">
          <input
            className="cr-book-title"
            type="text"
            placeholder="Boktitel"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          ></input>
          <span className="cr-book-fl-label">Boktitel</span>
        </label>
        <div className="cr-container-1">
          <label htmlFor="author">
            <input
              className="cr-book"
              type="text"
              placeholder="Författare"
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            ></input>
            <span className="cr-book-fl-label">Författare</span>
          </label>
          <label htmlFor="isbn">
            <input
              className="cr-book"
              type="text"
              placeholder="ISBN"
              id="isbn"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              required
            ></input>
            <span className="cr-book-fl-label">ISBN</span>
          </label>
          <label htmlFor="imageURL">
            <input
              className="cr-book"
              type="url"
              placeholder="Bildlänk (URL)"
              id="imageURL"
              value={imageURL}
              onChange={(e) => setImageURL(e.target.value)}
            ></input>
            <span className="cr-book-fl-label">Bildlänk (URL)</span>
          </label>
          <label htmlFor="language">
            <input
              className="cr-book"
              type="text"
              placeholder="Språk"
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            ></input>
            <span className="cr-book-fl-label">Språk</span>
          </label>
        </div>
        <div className="cr-container-2">
          <div className="cr-category-container">
            <EditCategories
              categories={categories}
              setCategories={setCategories}
            />
          </div>
          <label htmlFor="year">
            <input
              className="cr-book"
              type="number"
              placeholder="Utgivningsår"
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            ></input>
            <span className="cr-book-fl-label">Utgivningsår</span>
          </label>
          <label htmlFor="pages">
            <input
              className="cr-book"
              type="number"
              placeholder="Antal sidor"
              id="pages"
              value={pages}
              onChange={(e) => setPages(e.target.value)}
            ></input>
            <span className="cr-book-fl-label">Antal sidor</span>
          </label>
          <label htmlFor="weight">
            <input
              className="cr-book"
              type="number"
              placeholder="Vikt (gram)"
              id="weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            ></input>
            <span className="cr-book-fl-label">Vikt (gram)</span>
          </label>
          <label htmlFor="numInstock">
            <input
              className="cr-book"
              type="number"
              placeholder="Antal"
              id="numInstock"
              value={numInstock}
              onChange={(e) => setNumInstock(e.target.value)}
            ></input>
            <span className="cr-book-fl-label">Antal</span>
          </label>
          <label htmlFor="price">
            <input
              className="cr-book"
              type="number"
              placeholder="Pris"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            ></input>
            <span className="cr-book-fl-label">Pris</span>
          </label>
        </div>
        <div className="btn-area">
          <button type="submit">
            {isEdit ? "Uppdatera bok" : "Lägg upp bok"}
          </button>
          {isEdit && (
            <button type="button" onClick={() => setBookToEdit(null)}>
              Stäng
            </button>
          )}
          {isEdit && (
            <button
              type="button"
              className="btn-danger"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Ta bort bok
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default BookCrud;
