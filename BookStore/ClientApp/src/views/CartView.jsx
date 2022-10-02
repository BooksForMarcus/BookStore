import React from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import booksState from "../atoms/booksState";
import bookState from "../atoms/bookState";
import cartState from "../atoms/cartState";
import loggedInUserState from "../atoms/loggedInUserState";
import {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";



function CartView () {
   const book = useRecoilValue(bookState)
    const [cart, setCart] = useRecoilState(cartState)
    const [user, setUser] = useRecoilState(loggedInUserState);
    const [OrderCreated, setOrderCreated] = useState();
      const navigate = useNavigate();
      useEffect(() => {
        if (user === null) {
          navigate("/login");
        }
      }, []);
    

   const removeFromCart = () => {
    if (cart.some((cartBook) => cartBook.numInstock >= 2)) {
        setCart(
            cart.map((cartBook) => {
              return cartBook.id === book.id
                ? { ...cartBook, numInstock: cartBook.numInstock - 1 }
                : cartBook;
            })
          );
    } else{
        setCart(cart.filter((cartBook) => cartBook.id !== book.id));
        if(cart.map((cartbook) => cartbook === null)){
            return cart;
        }
    }
      
   };

   const newCart = () => {
    return { 
    customer: user,
    orderSum: cart.price,
    books: cart
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
    } else {
      console.log("customer create failed.");
      let json = await resp.json();
      console.log(json);
    }
  };


   const displayCart = () =>{
    return <div>
        {cart.map(book => (
            <div className="cartView-main-wrapper"> 
            <div>
                <h1 className="cartview-title">{book.title}</h1>
                <h2 className="cartview-author">av {book.author }</h2>
           <div className="book-info-wrapper">
                <div className="book-info-l">
                    {/* <p className="book-info">Genre:</p> */}
                    <p className="book-info">Utgivningsår:</p>
                    <p className="book-info">Språk:</p>
                    <p className="book-info">Antal:</p>
                </div>
                <div className="book-info-l">
                    <p className="book-info">{book.year}</p>
                    <p className="book-info">{book.language}</p>
                    <p className="book-info">{book.numInstock}</p>
                </div>
                <div className="book-info-r">
                    <span className="book-info-seller">SÄLJS AV</span>
                    {book.soldBy != "store" ? 
                    <span className="book-info">{book.soldBy}</span> 
                    :
                    <img className="store_logo" src={logo} alt="An image of bookstore logo" />
                    }
                    <span className="book-info-price">{book.price * book.numInstock} kr</span>
                    <button onClick={removeFromCart}>Ta bort från varukorgen</button>
                </div>
           </div>
           </div>
        </div>
        ))}
                            <button onClick={createNewOrder}>Skapa order</button>
    </div>
   }
   
    return(
            <main>
                {displayCart()}
            </main>
            
    );
    
}
export default CartView
