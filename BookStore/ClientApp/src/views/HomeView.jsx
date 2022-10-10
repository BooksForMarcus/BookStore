import React, { useState, useEffect } from "react";
import "../App.css";
import { useRecoilState } from "recoil";
import sideImageone from "../assets/image1.jpg";
import sideImagetwo from "../assets/image2.jpg";
import { Link } from "react-router-dom";
import BookCard from "../components/Books/BookCard";
import booksForShowState from "../atoms/booksForShowState";

function HomeView() {
  const [books, setBooks] = useRecoilState(booksForShowState);

  const getFiveNewBooks = () => {
    var newBooks = books.filter((b) => b.year == 2022 && b.soldById == "store");
    var firstFiveNewBooks = newBooks.slice(0, 5);
    return firstFiveNewBooks;
  };

  const getFiveUsedBooks = () => {
    var usedBooks = books.filter(
      (b) => b.soldById != "store" && b.numInstock > 0
    );
    var firstFiveUsedBooks = usedBooks.slice(0, 5);
    return firstFiveUsedBooks;
  };

  const getRandomBooks = (books) => {
    const localBooks = books.filter(
      (b) =>
        b.soldById == "store" || (b.soldById != "store" && b.numInstock > 0)
    );
    if (localBooks.length <= 5) return localBooks;

    let fiveRandomBooks = [];
    let usedNumbers = [];
    for (let i = 0; i < 5; i++) {
      let random = getRandomNumber(0, localBooks.length);
      if (!usedNumbers.includes(random)) {
        usedNumbers.push(random);
        fiveRandomBooks.push(localBooks[random]);
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
        <div className="book-image-wrapper"></div>
        <p>Kommer snart</p>
      </div>
    ) : (
      getFiveNewBooks().map((b, i) => {
        return <BookCard book={b} key={"newbook" + b.id} />;
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
        return <BookCard book={b} key={"used-" + b.id} />;
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
        return <BookCard book={b} key={"random-" + b.id} />;
      })
    );
  };

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
