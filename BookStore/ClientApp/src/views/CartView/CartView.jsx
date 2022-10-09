import React from "react";
import "./CartView.css";
import { useRecoilState } from "recoil";
import booksState from "../../atoms/booksState";
import cartState from "../../atoms/cartState";
import loggedInUserState from "../../atoms/loggedInUserState";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CarListItem from "./CartListItem";
import calculatePostage from "./calculatePostage";
import { getBooks } from "../../App";

function CartView() {
  const [books,setBooks] = useRecoilState(booksState);
  const [cart, setCart] = useRecoilState(cartState);
  const [user, setUser] = useRecoilState(loggedInUserState);
  const [orderOK, setOrderOK] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    if (user === null) {
      navigate("/login");
    }
  }, []);


  const newCart = () => {
	let orderBookPriceSum = 0;
	cart.forEach((book) => {
		orderBookPriceSum += book.price * book.numInstock;
	});
	const postage = calculatePostage(cart)
	const orderTotal = orderBookPriceSum + postage;
	const orderVat = orderBookPriceSum * 0.06 + postage*0.25;
    return {
      customer: user,
      books: cart,
	  orderSum: orderTotal,
	  postage: postage,
	  VAT: orderVat
    };
  };



  const createNewOrder = async (e) => {
    e.preventDefault();
    const newOrder = newCart();
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: user.password,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newOrder),
    };
    let resp = await fetch("/api/order/", requestOptions);
    if (resp.ok) {
      setOrderOK(true);
      let json = await resp.json();
	  setCart([]);
    getBooks(setBooks);
	  localStorage.removeItem("cart");
    } else {
      let json = await resp.json();
    }
  };

  const displayCart = () => {
    return (
      <div className='cart-main-wrapper'>
        <h3 className="order-title">Kundvagn</h3>
	  {cart!==null || cart.length>0?
        cart.map((book) => (
			<CarListItem key={"cart-"+book.id} allBooks={books} cart={cart} setCart={setCart} listItemBook={book}  />
        )): <div>Cart is empty</div>}
        <div className="order-info">
          {(cart!==null && cart.length>0) ?
          <div> 
           <span className="order-info-item-postage"> Frakt: {newCart(cart).postage.toFixed(2)} kr</span> 
           <span className="order-info-item-vat"> Moms: {newCart(cart).VAT.toFixed(2)} kr</span>
           <span className="order-info-item-sum"> Summa totalt: {newCart(cart).orderSum} kr</span>
           </div>
            : null}
          {(cart!==null && cart.length>0) ? 
          (
            <button className='cart-btn' onClick={createNewOrder}>Beställ</button>
          ): 
          <h3> Din kundvagn är tom</h3>}
        </div>
        {orderOK === true ? <h1>Din beställning är nu lagd, tack för att du handlar på Bokcirkeln</h1> : null}
      </div>
    );
  };

  return <main>{displayCart()}</main>;
}
export default CartView;
