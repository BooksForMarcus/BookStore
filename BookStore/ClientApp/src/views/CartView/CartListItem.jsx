import logo from '../../assets/boklogo.png'
import cartState from '../../atoms/cartState';
import './CartView.css';

const CarListItem = ({book,decreaseInCart, removeFromCart}) => {
	return (
		<div className='cartView-container'>
      <div className='cartView-info-l'>
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
        <span className='cartView-item-details'>{book.title}</span>
        <span className='cartView-item-details'>á pris: {book.price}</span>
        <span className='cartView-item-details'>Antal i varukorg: {book.numInstock}</span>
        <span className='cartView-item-details'>Summa: {book.price * book.numInstock}</span>
        {book.soldById !== "store" ? (
                    <div className="order-image"> Säljs begangnad av {book.soldById}</div>
                  ) : (
                    <div className='order-image'>
                    <img
                      className="store-logo"
                      src={logo}
                      alt="An image of bookstore logo"
                    />
                    </div> )}
        {book.numInstock >= 2 ? <button className='cart-item-button' onClick={()=>decreaseInCart(book)}>-</button>
         : <button className='cart-item-button' disabled>-</button> }
        <button className='cart-item-button' onClick={()=>removeFromCart(book)}>Ta bort från varukorg</button>
      </div>
    </div>
	  );
}

export default CarListItem;