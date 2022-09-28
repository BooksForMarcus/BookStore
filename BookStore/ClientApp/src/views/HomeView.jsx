import React, { useState, useEffect } from "react";
import "../App.css";
import { useRecoilState } from "recoil";
import booksState from "../atoms/booksState";
import sideImageone from "../assets/image1.jpg";
import sideImagetwo from "../assets/image2.jpg";
import { Link } from "react-router-dom";

function HomeView() {
    const [books, setBooks] = useRecoilState(booksState);
/*    const [book, setBook] = useRecoilState(bookState);*/

//   const getBooks = async () => {
//         const resp = await fetch("/api/Book");
//         const json = await resp.json();
//         setBooks(json);
//     };

    const getFiveNewBooks = () => {
        var newBooks = books.filter((b) => b.year == 2022 && b.soldById == "store");
        var firstFiveNewBooks = newBooks.slice(0, 5);
        return firstFiveNewBooks;
  };

  const getFiveUsedBooks = () => {
        var usedBooks = books.filter((b) => b.soldById != "store");
        var firstFiveUsedBooks = usedBooks.slice(0, 5);
        return firstFiveUsedBooks;
  };

  const getRandomBooks = (books) => {
        if (books.length <= 5) return books

        let fiveRandomBooks = [];
        let usedNumbers = [];
        for (let i = 0; i < 5; i++) {
            let random = getRandomNumber(0, books.length);
            if (!usedNumbers.includes(random)) {
                usedNumbers.push(random);
                fiveRandomBooks.push(books[random]);
            }
        }
        return fiveRandomBooks;
  };

  const getRandomNumber = (min, max) => {
        return Math.floor(Math.random() * (max - min) + min);
  };

  const ShowTopFiveNewBooks = () => {

    return books === null ? (
      <div className="card-product">
        <div className="book-image-wrapper">
            
        </div>
        <p>Kommer snart</p>
      </div>
    ) : (
      getFiveNewBooks().map((b, i) => {
          return (
            <Link
                  to={`book/${b.id}`}
                  state={b}
            className="card-product-link" key={b.id}>
            <div className="card-product">
                <div className="book-image-wrapper">
                    <img
                    className="book-img"
                    src={b.imageURL}
                    alt="Front image of book"
                    >
                    </img>
                </div>
                <span className="card-product-title">{b.title}</span>
                <span className="card-product-price">{b.price} kr</span>
            </div>
            </Link>
          );
      })
    );
  };

  const ShowTopFiveUsedBooks = () => {

      return books === null ? (
      <div className="card-product">
        <div className="book-image-wrapper"></div>
        <p>Kommer snart</p>
      </div>
    ) : (
      getFiveUsedBooks().map((b, i) => {
          return (
            <Link
            to={`book/${b.id}`}
            state={b}
            className="card-product-link" key={b.id}>
            <div className="card-product">
                <div className="book-image-wrapper">
                    <img
                    className="book-img"
                    src={b.imageURL}
                    alt="Front image of book"
                    >
                    </img>
                </div>
                <span className="card-product-title">{b.title}</span>
                <span className="card-product-price">{b.price} kr</span>
             </div>
             </Link>
          );
      })
    );
  };

    const ShowRandomBooks = () => {

        return books === null ? (
            <div className="card-product">
                <div className="book-image-wrapper"></div>
                <p>Kommer snart</p>
            </div>
        ) : (
            getRandomBooks(books).map((b, i) => {
                return (
                  <Link
                    to={`book/${b.id}`}
                    state={b}
                    className="card-product-link" key={b.id}>
                    <div className="card-product">
                        <div className="book-image-wrapper">
                            <img
                                className="book-img"
                                src={b.imageURL}
                                alt="Front image of book"
                            >
                            </img>
                        </div>
                        <span className="card-product-title">{b.title}</span>
                        <span className="card-product-price">{b.price} kr</span>
                    </div>
                    </Link>
                );
            })
        );
    };

//   useEffect(() => {
//     if(books===null){
// 		getBooks();
// 	} 
//   }, []);

  return (
    <div className="main-container">
      <div className="side">
        <img className="side_img" src={sideImageone} alt="An image of books" />
        <img
          className="side_img"
          src={sideImagetwo}
          alt="An image of a dog reading books"
        />
      </div>
      <div className="main-wrapper">
        <h3>Top 5 Nyheter</h3>
        <div className="card">
          <ShowTopFiveNewBooks />
        </div>
        <h3>Top 5 Begagnat</h3>
        <div className="card">
          <ShowTopFiveUsedBooks />
        </div>
        <h3>Hitta något nytt!</h3>
        <div className="card">
          <ShowRandomBooks />
        </div>
      </div>
    </div>
  );
}

export default HomeView;
