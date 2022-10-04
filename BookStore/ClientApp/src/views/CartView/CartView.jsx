import React from "react";
import "./CartView.css";
import { useRecoilState } from "recoil";
import booksState from "../../atoms/booksState";
import cartState from "../../atoms/cartState";
import loggedInUserState from "../../atoms/loggedInUserState";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CarListItem from "./CartListItem";

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

    const decreaseInCart = (bookToDecrease) => {
      console.log("in decreaseInCart, bookToDecrease is: ", bookToDecrease)
	if(bookToDecrease.numInstock >= 2){
		const newCart = cart.map((book) => {
		  if (book.id === bookToDecrease.id) {
			return { ...book, numInstock: book.numInstock - 1 };
		  } else {
			return book;
		  }
		});
		setCart(newCart);
	}
	else {
		const newCart = cart.filter((book) => book.id !== bookToDecrease.id);
		setCart(newCart);
	}
  };

  const newCart = () => {
	let orderSum = 0;
	cart.forEach((book) => {
		orderSum += book.price * book.numInstock;
	});
	const orderVat = orderSum * 0.06;
    return {
      customer: user,
      books: cart,
	  orderSum: orderSum,
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
	  localStorage.removeItem("cart");
    } else {
      console.log("order create failed.");
      let json = await resp.json();
      console.log(json);
    }
  };

  const displayCart = () => {
    return (
      <div>
	  {cart!==null || cart.length>0?
        cart.map((book) => (
			<CarListItem key={"cart-"+book.id} book={book} decreaseInCart={decreaseInCart}/>
        )): <div>Cart is empty</div>}
        <div>
          {(cart!==null && cart.length>0) ? <button onClick={createNewOrder}>Skapa order</button> : <h3> Din kundvagn är tom</h3>}
        </div>
      </div>
    );
  };

  return <main>{displayCart()}</main>;
}
export default CartView;
