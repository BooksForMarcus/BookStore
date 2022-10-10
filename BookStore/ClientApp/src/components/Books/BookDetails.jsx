import { useRecoilState, useRecoilValue } from "recoil";
import cartState from "../../atoms/cartState";
import begstamp from "../../assets/begagnad-stamp.png";
import logo from "../../assets/boklogo.png";
import { useState } from "react";
import loggedInUserState from "../../atoms/loggedInUserState";
import { Link } from "react-router-dom";

const BookDetails = ({ book }) => {
  const user = useRecoilValue(loggedInUserState);
  const [cart, setCart] = useRecoilState(cartState);
  const [showNotInStock, setShowNotInStock] = useState(false);

  const addToCart = () => {
    let cartUpdate = [];
    if (!cart.some((cartBook) => cartBook.id === book.id)) {
      cartUpdate = [...cart, { ...book, numInstock: 1 }];
    } else {
      cartUpdate = cart.map((cartBook) => {
        return cartBook.id === book.id
          ? { ...cartBook, numInstock: cartBook.numInstock + 1 }
          : cartBook;
      });
    }
    setCart(cartUpdate);
    localStorage.setItem("cart", JSON.stringify(cartUpdate));
  };

  return (
    <div className="bookView-main-wrapper">
      {!book.imageURL || book.imageURL.lenght === 0 ? (
        <div className="bookView-image-wrapper">
          <div className="bookView-image-placeholder">
            <h4>Bild</h4>
          </div>
        </div>
      ) : (
        <div className="bookView-image-wrapper">
          <img
            className="bookView-img"
            src={book.imageURL}
            alt="Front image of book"
          ></img>
        </div>
      )}

      <div>
        <h1 className="bookview-title">{book.title}</h1>
        <h2 className="bookview-author">av {book.author}</h2>
        <div className="book-info-wrapper">
          <div className="book-info-l">
            <p className="book-info">Utgivningsår:</p>
            <p className="book-info">Språk:</p>
            <p className="book-info">Antal sidor:</p>
            <p className="book-info">Vikt:</p>
            <p className="book-info">ISBN:</p>
          </div>
          <div className="book-info-l">
            <p className="book-info">{book.year}</p>
            <p className="book-info">{book.language}</p>
            <p className="book-info">{book.pages} st</p>
            <p className="book-info">{book.weight} gram</p>
            <p className="book-info">{book.isbn}</p>
          </div>
          <div className="book-info-r">
            {book.soldById !== "store" ? (
              <img
                className="beg-stamp-bookView"
                src={begstamp}
                alt="Image of reused secondhand stamp"
              />
            ) : (
              <div className="book-info-seller">
                <span className="book-info-seller-text">SÄLJS AV</span>
                <img
                  className="store_logo"
                  src={logo}
                  alt="An image of bookstore logo"
                />
              </div>
            )}
            <span className="book-info-price">{book.price} kr</span>
            { user!== null ? <button
              onClick={addToCart}
              disabled={
                user === null ||
                  cart.some((cartBook) => cartBook.id === book.id) &&
                  cart.find((cartBook) => cartBook.id === book.id).numInstock >=
                    book.numInstock ||
                book.numInstock <= 0
              }
            >
              {cart!== null && cart.find((cartBook) => cartBook.id === book.id) ? (
                <span>
                  {cart.find((cartBook) => cartBook.id === book.id).numInstock}{" "}
                  st i varukorgen
                </span>
              ) : (
                <span>Lägg i varukorgen</span>
              )}
            </button>:<Link to="/login">Logga in för att beställa böcker.</Link>}
            {(cart !==null && cart.some((cartBook) => cartBook.id === book.id) &&
              cart.find((cartBook) => cartBook.id === book.id).numInstock >=
                book.numInstock) ||
            book.numInstock <= 0 ? (
              <span className="out-of-stock-text">Slut i lager</span>
            ) : (
              <span></span>
			 
            )}
          </div>{console.log(user)}
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
