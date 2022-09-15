import React, { useState, useEffect } from "react";
import "../App.css";
import { useRecoilState } from "recoil";
import booksState from "../atoms/booksState";
import sideImageone from "../assets/image1.jpg";
import sideImagetwo from "../assets/image2.jpg";

function HomeView() {
  const [books, setBooks] = useRecoilState(booksState);
  const oldbooklist = [];

  const getBooks = async () => {
    const resp = await fetch("/api/Book");
    const json = await resp.json();
    console.log(json);
    setBooks(json);
  };

  const getUsedBooks = () => {
    books.map((b, i) => {
      if (!b.soldBy === "store") oldbooklist[i] = b;
    });
  };

  const GetTopFiveNewBooks = () => {
    let k = 0;

    return books === null ? (
      <div className="card-product">
        <div className="book-image-wrapper">
            
        </div>
        <p>Kommer snart</p>
      </div>
    ) : (
      books.map((b, i) => {
        if (k < 4 && b.year === 2022)
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
        k++;
      })
    );
  };

  const GetTopFiveUsedBooks = () => {
    let n = -2;

    return books === null ? (
      <div className="card-product">
        <div className="book-image-wrapper"></div>
        <p>Kommer snart</p>
      </div>
    ) : (
      books.map((b, i) => {
        if (n > 5 && b.soldBy != "store")
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
        n++;
      })
    );
  };

  useEffect(() => {
    if(books===null){
		console.log("Im gonna fetch the books!")
		getBooks();
	} 
  }, []);

  return (
    <main>
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
          <GetTopFiveNewBooks />
        </div>
        <h3>Top 5 Begagnat</h3>
        <div className="card">
          <GetTopFiveUsedBooks />
        </div>
        <h3>Hitta något nytt!</h3>
        <div className="card">
          <div className="card-product">
            <div className="book-image"></div>
            <p>Boktitel</p>
          </div>
          <div className="card-product">
            <div className="book-image"></div>
            <p>Boktitel</p>
          </div>
          <div className="card-product">
            <div className="book-image"></div>
            <p>Boktitel</p>
          </div>
          <div className="card-product">
            <div className="book-image"></div>
            <p>Boktitel</p>
          </div>
          <div className="card-product">
            <div className="book-image"></div>
            <p>Boktitel</p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default HomeView;
