import { useRecoilState } from "recoil";
import cartState from "../../atoms/cartState";
import begstamp from "../../assets/begagnad-stamp.png";
import logo from "../../assets/boklogo.png";
import { useState } from "react";

const BookDetails = ({ book }) => {
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
      {!book.imageURL ? (
        <div className="bookView-image-wrapper">
          <h4>Bild</h4>
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
              />) : (
              <div className="book-info-seller">
              <span className="book-info-seller-text">SÄLJS AV</span>
              <img
                className="store_logo"
                src={logo}
                alt="An image of bookstore logo"
              />
              </div>)}
            <span className="book-info-price">{book.price} kr</span>
            <button
              onClick={addToCart}
              disabled={
                cart.some((cartBook) => cartBook.id === book.id) &&
                cart.find((cartBook) => cartBook.id === book.id).numInstock >=
                  book.numInstock
              }
            >
              {cart.find((cartBook) => cartBook.id === book.id) 
              ? (<span>{cart.find((cartBook) => cartBook.id === book.id).numInstock}st i varukorgen</span>)
              :
              (<span>Lägg i varukorgen</span>)
              }
            </button>
            {cart.some((cartBook) => cartBook.id === book.id) &&
              cart.find((cartBook) => cartBook.id === book.id).numInstock >=
              book.numInstock ? (
                <span className="out-of-stock-text">Nu finns det inte fler av denna vara i lager</span>
              ) : (
                <span></span>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
