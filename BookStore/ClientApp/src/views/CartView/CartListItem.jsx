import { useRecoilState } from 'recoil';
import logo from '../../assets/boklogo.png'
import cartState from '../../atoms/cartState';
import './CartView.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

const CarListItem = ({book,decreaseInCart, removeFromCart, addToCart}) => {
  const cart = useRecoilState(cartState);
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
         <span className='cartView-item-details-amount'>{book.numInstock}</span>
         <button className='cart-item-button' onClick={()=> addToCart(book)} 
         disabled={cart.some((cartBook) => cartBook.id === book.id) && cart.find((cartBook)=> cartBook.id === book.id).numInstock >= book.numInstock
         || book.numInstock === 0}>
         + </button>
        <button className='cart-item-remove-button' onClick={()=>removeFromCart(book)}><FontAwesomeIcon icon={faTrashCan}/></button>
      </div>
    </div>
	  );
}

export default CarListItem;