import logo from '../../assets/boklogo.png'
import './CartView.css';

const CarListItem = ({book,decreaseInCart}) => {
	return (
		<div className='cartView-container'>
      <div className='cartView-info-l'>
        <span className='cartView-item-details'>{book.title}</span>
        {!book.imageURL ? (
                                <div className="order-image">
                                    <h4>Bild</h4>
                                </div>
                            ) : (
                                <div className="order-image">
                                <img
                                className="order-img"
                                src={book.imageURL}
                                alt="Front image of book"
                                ></img>
                                </div>
                            )}
        <span className='cartView-item-details'>Utgivningsår: {book.year}</span>
        <span className='cartView-item-details'>Genre: {book.categories}</span>
        <span className='cartView-item-details'>á pris: {book.price}</span>
        <span className='cartView-item-details'>Antal i varukorg: {book.numInstock}</span>
        <span className='cartView-item-details'>Summa: {book.price * book.numInstock}</span>
        {book.soldById !== "store" ? (
                    <span className="cartView-item-details"> Säljs begangnad av {book.soldById}</span>
                  ) : (
                    <img
                      className="store_logo"
                      src={logo}
                      alt="An image of bookstore logo"
                    />)}
        <button className='cart-item-button' onClick={()=>decreaseInCart(book)}>Ta bort från varukorg</button>
      </div>
    </div>
	  );
}

export default CarListItem;