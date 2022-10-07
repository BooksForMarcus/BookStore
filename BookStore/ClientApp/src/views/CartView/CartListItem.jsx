import { useRecoilState } from "recoil";
import logo from "../../assets/boklogo.png";
import "./CartView.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

const CarListItem = ({ cart, setCart, allBooks, listItemBook }) => {
  const addToCart = (book) => {
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

  const removeFromCart = (bookToRemove) => {
    console.log("in decreaseInCart, bookToDecrease is: ", bookToRemove);
    const newCart = cart.filter((book) => book.id !== bookToRemove.id);
    setCart(newCart);
  };

  const decreaseInCart = (bookToDecrease) => {
    console.log("in decreaseInCart, bookToDecrease is: ", bookToDecrease);
    if (bookToDecrease.numInstock >= 2) {
      const newCart = cart.map((book) => {
        if (book.id === bookToDecrease.id && bookToDecrease.numInstock >= 1) {
          return { ...book, numInstock: book.numInstock - 1 };
        } else {
          return book;
        }
      });
      setCart(newCart);
    }
  };

  return (
    <div className="cartView-container">
      <div className="cartView-info-l">
        {!listItemBook.imageURL ? (
          <div className="order-image">
            <h4>Bild</h4>
          </div>
        ) : (
          <div className="order-image">
            <img
              className="order-img"
              src={listItemBook.imageURL}
              alt="Front image of book"
            ></img>
          </div>
        )}
        <span className="cartView-item-details">{listItemBook.title}</span>
        <span className="cartView-item-details">
          á pris: {listItemBook.price}
        </span>
        <span className="cartView-item-details">
          Summa: {listItemBook.price * listItemBook.numInstock}
        </span>
        {listItemBook.soldById !== "store" ? (
          <div className="order-image">
            {" "}
            Säljs begangnad av {listItemBook.soldById}
          </div>
        ) : (
          <div className="order-image">
            <img
              className="store-logo"
              src={logo}
              alt="An image of bookstore logo"
            />
          </div>
        )}
        {listItemBook.numInstock >= 2 ? (
          <button
            className="cart-item-button"
            onClick={() => decreaseInCart(listItemBook)}
          >
            -
          </button>
        ) : (
          <button className="cart-item-button" disabled>
            -
          </button>
        )}
        <span className="cartView-item-details-amount">
          {listItemBook.numInstock}
        </span>
        <button
          className="cart-item-button"
          onClick={() => addToCart(listItemBook)}
          disabled={
            listItemBook.numInstock >=
            allBooks.find((book) => book.id === listItemBook.id).numInstock
          }
        >
          +{" "}
        </button>
        <button
          className="cart-item-remove-button"
          onClick={() => removeFromCart(listItemBook)}
        >
          <FontAwesomeIcon icon={faTrashCan} />
        </button>
      </div>
    </div>
  );
};

export default CarListItem;
