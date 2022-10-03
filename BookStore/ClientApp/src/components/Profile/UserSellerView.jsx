import { useState, useEffect } from "react";
import "../../App.css";
import { useRecoilState } from "recoil";
import loggedInUserState from "../../atoms/loggedInUserState";
import booksState from "../../atoms/booksState";
import BookCrud from "../AddBook/BookCrud";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

function UserSellerView() {
  const [user, setUser] = useRecoilState(loggedInUserState);
  const [books, setBooks] = useRecoilState(booksState);
  const [bookToEdit, setBookToEdit] = useState(null);
  const navigate = useNavigate();

  const getSellersBooks = () => {
    var sellersBooks = books.filter((b) => b.soldById == user.id);
    return sellersBooks;
  };
  
  const ListBooks = () => {
    return books === null ? (
      <div className="seller-book-listitem-empty">
        <p>Laddar in böcker...</p>
      </div>
    ) : user !== null ? (
      getSellersBooks().map((b, i) => {
        return (
          <div className="seller-book-listitem" key={"seller" + b.id}>
            <Link
              to={`/book/${b.id}`}
              state={b}
              className="seller-book-listitem-title"
            >
              {b.title}
            </Link>
            <span className="seller-book-listitem-text-status">
              {b.price} sek
            </span>
            <span className="seller-book-listitem-text-status">
              {b.numInstock} st
            </span>
            {b.numInstock === 0 ? 
            (<span className="seller-book-listitem-text-status">Såld</span>)
            :
            (<span className="seller-book-listitem-text-status">Pågående</span>)}
            <span
              className="seller-book-listitem-icon"
              onClick={() => setBookToEdit(b)}
            >
              <FontAwesomeIcon icon={faPen} />
            </span>
          </div>
        );
      })
    ) : null;
  };

  useEffect(() => {
    setBookToEdit(bookToEdit);
  });

  return (
    <div className="seller-wrap">
      <h2 className="h2-light">Sälj böcker</h2>
      {bookToEdit === null ? (
        <BookCrud isEdit={false} />
      ) : (
        <BookCrud
          isEdit={true}
          book={bookToEdit}
          setBookToEdit={setBookToEdit}
        />
      )}
      <h2 className="seller-profile-head-text">Försäljningar</h2>
      <div className="seller-profile-booklist">
        <div className="seller-profile-booklist-h">
          <span className="seller-profile-booklist-h-titletext">Titel</span>
          <span className="seller-profile-booklist-h-text">Pris</span>
          <span className="seller-profile-booklist-h-text">Antal</span>
          <span className="seller-profile-booklist-h-status">Status</span>
        </div>
        <ListBooks />
      </div>
    </div>
  );
}

export default UserSellerView;
