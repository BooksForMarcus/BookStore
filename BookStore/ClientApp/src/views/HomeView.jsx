import React, { useState } from 'react'
import "../App.css";
import { useRecoilState } from "recoil";
import booksState from "../atoms/booksState";

function HomeView() {
    const [book, setBook] = useRecoilState(booksState);

    const getBooks = async () => {
        const resp = await fetch("/api/Book");
        const json = await resp.json();
        console.log(json);
        setBook(json);
    };

    return (
        <main>
            <div className="side">
                <button onClick={getBooks}>Böcker</button>
            </div>
            <div className="main-wrapper">
                <h3>Top 5 Nyheter</h3>
                <div className="card">
                    {book === null ? (
                        <div className="card-product">
                            <div className="book-image"></div>
                            <p>Kommer snart</p>
                        </div>
                    ) : (
                        book.map((b, i) => {
                            return
                            <div className="card-product">
                                <div className="book-image"></div>
                                <p key={i}>{b.Title}</p>
                            </div>;
                        })
                    )}
                </div>
                <h3>Top 5 Begagnat</h3>
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
