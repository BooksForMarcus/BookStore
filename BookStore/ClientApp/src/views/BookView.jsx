import React, { useState, useEffect } from "react";
import "../App.css";
import { useRecoilState } from "recoil";
import booksState from "../atoms/booksState";
import { useLocation } from "react-router-dom";

function BookView() {
   /*  const [books, setBooks] = useRecoilState(booksState);
    const loc = useLocation();

    const getBook = () => {
        var book = books.filter((b) => b.id == loc.state.id);
        return book;
    }; */


    const ShowBook = () => {

        return book === null ? (
            <div className="card-product">
                <div className="book-image-wrapper"></div>
                <p>Kommer snart</p>
            </div>
        ) : (
            getBook().map((b, i) => {
                return (
                    <div className="card-product" key={b.id}>
                        <div className="book-image-wrapper">
                            <img
                                className="book-img"
                                src={b.imageURL}
                                alt="Front image of book"
                            >
                            </img>
                        </div>
                        <p>{b.title}</p>
                        <p>{b.price}kr</p>
                    </div>
                );
            })
        );
    };

   /*  useEffect(() => {
        getBook();
    }, []); */

    return (
        <div className="main-container">
            <div className="side"></div>
            <div className="bookView-main-wrapper">
               {/* <ShowBook /> */}
               <div className="bookView-image-wrapper">
                    <h4>Bild</h4>
               </div>
               <div>
               <h1>En medellång titel här</h1>
               <h2>av Författare</h2>
               <div className="book-info-wrapper">
                    <div className="book-info-l">
                        <p className="book-info">Utgivningsår:</p>
                        <p className="book-info">Språk:</p>
                        <p className="book-info">Antal sidor:</p>
                        <p className="book-info">Vikt:</p>
                        <p className="book-info">ISBN:</p>
                    </div>
                    <div className="book-info-l">
                        <p className="book-info">2022</p>
                        <p className="book-info">Svenska</p>
                        <p className="book-info">100 st</p>
                        <p className="book-info">346 gram</p>
                        <p className="book-info">9789189359772</p>
                    </div>
                    <div className="book-info-r">
                        <span className="book-info-seller">SÄLJS AV</span>
                        <span className="book-info">Bokcirkeln</span>
                        <span className="book-info-price">100 kr</span>
                        <button>Lägg i varukorgen</button>
                    </div>
               </div>
               </div>
            </div>
        </div>
    );
}

export default BookView;
