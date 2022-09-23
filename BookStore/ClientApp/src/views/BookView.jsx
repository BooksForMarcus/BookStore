import React, { useState, useEffect } from "react";
import "../App.css";
import { useLocation } from "react-router-dom";
import logo from '../assets/boklogo.png'

function BookView() {
    const loc = useLocation();
    var book = loc.state;

    return (
        <div className="main-container">
            <div className="side"></div>
            <div className="bookView-main-wrapper"> 
                {!book.imageURL ? 
                <div className="bookView-image-wrapper">
                    <h4>Bild</h4>
                </div> :
                <div className="bookView-image-wrapper">
                    <img
                    className="bookView-img"
                    src={book.imageURL}
                    alt="Front image of book"
                    >
                    </img>
                </div>
                }
                <div>
                    <h1 className="bookview-title">{book.title}</h1>
                    <h2 className="bookview-author">av {book.author }</h2>
               <div className="book-info-wrapper">
                    <div className="book-info-l">
                        <p className="book-info">Utgivningsår:</p>
                        <p className="book-info">Språk:</p>
                        <p className="book-info">Antal sidor:</p>
                        <p className="book-info">Vikt:</p>
                        <p className="book-info">ISBN:</p>
                    </div>
                    <div className="book-info-l">
                        <p className="book-info">{book.year}</p>
                        <p className="book-info">{book.language}</p>
                        <p className="book-info">{book.pages} st</p>
                        <p className="book-info">{book.weight} gram</p>
                        <p className="book-info">{book.isbn}</p>
                    </div>
                    <div className="book-info-r">
                        <span className="book-info-seller">SÄLJS AV</span>
                        {book.soldBy != "store" ? 
                        <span className="book-info">{book.soldBy}</span> 
                        :
                        <img className="store_logo" src={logo} alt="An image of bookstore logo" />
                        }
                        <span className="book-info-price">{book.price} kr</span>
                        <button disabled>Lägg i varukorgen</button>
                    </div>
               </div>
               </div>
            </div>
        </div>
    );
}

export default BookView;
