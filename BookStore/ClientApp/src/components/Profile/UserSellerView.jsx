import { useState, useEffect } from "react";
import "../../App.css";
import { useRecoilState } from "recoil";
import loggedInUserState from "../../atoms/loggedInUserState";
import booksState from "../../atoms/booksState";
import AddBookView from "../AddBook/AddBookView";
import { Link } from "react-router-dom";

function UserSellerView() {

    const [user, setUser] = useRecoilState(loggedInUserState);
    const [books, setBooks] = useRecoilState(booksState);

    const getSellersBooks = () => {
        var sellersBooks = books.filter((b) => b.soldById == user.id);
        return sellersBooks;
    };

    const ListBooks = () => {

        return books === null ? (
            <div className="seller-book-listitem">
                <p>Du har inga böcker till salu :-(</p>
            </div>
        ) : (
            getSellersBooks().map((b, i) => {
                return (
                    <div className="seller-book-listitem">
                        <Link
                            to={`/book/${b.id}`}
                            state={b}
                            className="seller-book-listitem-title"
                            key={b.id}
                        >
                            {b.title}
                        </Link>
                        <span className="seller-book-listitem-text">{b.price} sek</span>
                        <span className="seller-book-listitem-text">Status</span>
                    </div>
                );
            })
        );
    };

  return (
      <div className="profileNav-wrap">
        <h2 className="ud-head-text">Sälj böcker</h2>
          <AddBookView />
              <h2 className="seller-profile-head-text">Försäljningar</h2>
              <div className="seller-profile-booklist">
                  <div className="seller-profile-booklist-h">
                      <span className="seller-profile-booklist-h-titletext">Titel</span>
                      <span className="seller-profile-booklist-h-text">Pris</span>
                      <span className="seller-profile-booklist-h-text">Status</span>
                  </div>
                  <ListBooks />
              </div>
      </div>
  );
}

export default UserSellerView;
