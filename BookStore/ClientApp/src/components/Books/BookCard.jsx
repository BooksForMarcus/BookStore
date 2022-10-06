import { Link } from "react-router-dom";

const BookCard = ({ book }) => {
  const b = book;
  return (
    <Link
      to={`book/${b.id}`}
      state={b}
      className="card-product-link"
      key={b.id}
    >
      <div
        className={
          b.soldById === "store" ? "card-product" : "card-product used-book"
        }
      >
        <div className="book-image-wrapper">
          <img
            className="book-img"
            src={b.imageURL}
            alt="Front image of book"
          ></img>
        </div>
        <span className="card-product-title">{b.title}</span>
        <span className="card-product-price">{b.price} kr</span>
      </div>
    </Link>
  );
};

export default BookCard;
