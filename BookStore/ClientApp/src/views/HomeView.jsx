import React, { useState } from 'react'
import "../App.css";
import { useRecoilState } from "recoil";
import weatherState from "../atoms/weatherState";

function HomeView() {
    const [weather, setWeather] = useRecoilState(weatherState);
    const [book, setBook] = useState();

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
                        <p>Kommer snart</p>
                    ) : (
                        book.map((b, i) => {
                            return
                            <div className="card-product">
                                <div className="book-image"></div>
                                    <p key={i}>{b.title}</p>
                            </div>;
                        })
                    )}
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
