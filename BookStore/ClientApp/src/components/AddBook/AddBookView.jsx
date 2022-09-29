import { useState, useEffect } from "react";
import "../../App.css";
import "./addBook.css"
import { useRecoilState } from "recoil";
import loggedInUserState from "../../atoms/loggedInUserState";
import getBasicAuthString from "../../getBasicAuthString";
import ModalBaseFull from "../Modal/ModalBaseFull";

const AddBookView = () => {

  const [user, setUser] = useRecoilState(loggedInUserState);
  const [isbn, setIsbn] = useState("");
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("");
  const [categories, setCategories] = useState([]);
  const [numInstock, setNumInstock] = useState("");
  const [price, setPrice] = useState("");
  const [year, setYear] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [pages, setPages] = useState("");
  const [weight, setWeight] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showBookCreated, setShowBookCreated] = useState(false);
  const [bookCreated, setBookCreated] = useState(false);
  const [bookCreateError, setBookCreateError] = useState(null);

   const AddBook = async (e) => {
    e.preventDefault();


    const newBook = JSON.stringify({
        isbn: isbn,
        author: author,
        title: title,
        language: language,
        categories: categories,
        numInstock: numInstock,
        price: price,
        year: year,
        soldById: user.id,
        imageURL: imageURL,
        pages: pages,
        weight: weight,
    });

    console.log(newBook);
    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: newBook,
    };

    let resp = await fetch("/api/Book/", requestOptions);
    if (resp.ok) {
      console.log("Book created");
      setBookCreated(true);
      let json = await resp.json();
      console.log(json);
    } else {
      console.log("Book create failed.");
      let json = await resp.json();
      console.log(json);
      setBookCreateError(json);
    }
  };

  return (
    <div>
        <form className="add-book-wrap" onSubmit={AddBook}>
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
            type="text"
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
            <div className="cr-category-container"></div>
            <input
            className="cr-book"
            type="string"
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
          <div></div>
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
          <button type="submit"
          onClick={() => setShowBookCreated(true)}>
            Lägg upp bok
          </button>
        </form>
      </div>
  );
};

export default AddBookView;
