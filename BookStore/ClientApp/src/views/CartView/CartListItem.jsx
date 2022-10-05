import logo from '../../assets/boklogo.png'
import begstamp from "../../assets/begagnad-stamp.png";
import './CartView.css';

const CarListItem = ({book,decreaseInCart}) => {
	return (
		<div className='cartView-container'>
      <div className='cartView-info-l'>
        <span className='cartView-item-details-title'>{book.title}</span>
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