import React, { useState, useEffect } from 'react'
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

    const GetTopFiveNewBooks = () => {

        return book === null ? (
            <div className="card-product">
                <div className="book-image"></div>
                <p>Kommer snart</p>
            </div>
        ) : 
            book.map((b, i) => {
                if (b.year === 2022 & b.soldBy === "store")
                return (<div className="card-product">
                    <div className="book-image"></div>
                    <p key={b.isbn}>{b.title}</p>
                    <p key={b.isbn}>{b.price}kr</p>
                </div>
            )}
        );
    }


    const GetTopFiveUsedBooks = () => {

        return book === null ? (
            <div className="card-product">
                <div className="book-image"></div>
                <p>Kommer snart</p>
            </div>
        ) :
            book.map((b, i) => {
                if (b.soldBy != "store")
                    return (<div className="card-product">
                        <div className="book-image"></div>
                        <p key={b.isbn}>{b.title}</p>
                        <p key={b.isbn}>{b.price}kr</p>
                    </div>
                    )
            }
            );
    }

    useEffect(() => {
        getBooks() 
    }, []);

    return (
        <main>
            <div className="side">
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
