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

function CartView() {
  const [books,setBooks] = useRecoilState(booksState);
  const [cart, setCart] = useRecoilState(cartState);
  const [user, setUser] = useRecoilState(loggedInUserState);
  const [orderCreated, setOrderCreated] = useState();

  const navigate = useNavigate();
  useEffect(() => {
    if (user === null) {
      navigate("/login");
    }
  }, []);

    

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
    console.log(newOrder);
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
      console.log("create order ok");
      setOrderCreated(true);
      let json = await resp.json();
      console.log(json);
	  setCart([]);
    setBooks()
	  localStorage.removeItem("cart");
    } else {
      console.log("order create failed.");
      let json = await resp.json();
      console.log(json);
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
            <div >
           <span className="order-info-item"> Frakt: {newCart(cart).postage.toFixed(2)} kr</span> 
           <span className="order-info-item"> Moms: {newCart(cart).VAT.toFixed(2)} kr</span>
           </div>
           <div className="order-info-item">
           <span className="order-info-item"> Summa totalt: {newCart(cart).orderSum}kr</span>
           </div>
           </div>
            : null}
          {(cart!==null && cart.length>0) ? 
          (<div>
            <button className='cart-btn' onClick={createNewOrder}>Beställ</button>
          </div>
          ): 
          <h3> Din kundvagn är tom</h3>}
        </div>
      </div>
    );
  };

  return <main>{displayCart()}</main>;
}
export default CartView;
