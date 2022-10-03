import logo from '../../assets/boklogo.png'

const CarListItem = ({book,decreaseInCart}) => {
	return (
		<div className="cartView-main-wrapper">
            <div>
              <h1 className="cartview-title">{book.title}</h1>
              <h2 className="cartview-author">av {book.author}</h2>
              <div className="book-info-wrapper">
                <div className="book-info-l">
                  {/* <p className="book-info">Genre:</p> */}
                  <p className="book-info">Utgivningsår:</p>
                  <p className="book-info">Språk:</p>
                  <p className="book-info">Antal:</p>
                  <p className="book-info">á Pris: {book.price} kr</p>
                </div>
                <div className="book-info-l">
                  <p className="book-info">{book.year}</p>
                  <p className="book-info">{book.language}</p>
                  <p className="book-info">{book.numInstock}</p>
                </div>
                <div className="book-info-r">
                  <span className="book-info-seller">SÄLJS AV</span>
                  {book.soldById !== "store" ? (
                    <span className="book-info">{book.soldById}</span>
                  ) : (
                    <img
                      className="store_logo"
                      src={logo}
                      alt="An image of bookstore logo"
                    />
                  )}
                  <span className="book-info-price">
					Summa: {book.price * book.numInstock} kr
                  </span>
				  <p>I korgen: {book.numInstock}</p>
                  <button onClick={()=>decreaseInCart(book)}>
                    Ta bort från varukorgen
                  </button>
                </div>
              </div>
            </div>
          </div>
	  );
}

export default CarListItem;