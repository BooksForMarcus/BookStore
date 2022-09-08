import React from 'react'
import "../App.css";
import { useRecoilState } from "recoil";
import weatherState from "../atoms/weatherState";

function HomeView() {
    const [weather, setWeather] = useRecoilState(weatherState);

    const getWeather = async () => {
        const resp = await fetch("/api/weatherforecast");
        const json = await resp.json();
        console.log(json);
        setWeather(json);
    };

    return (
        <main>
            <div className="side">
                {/*<button onClick={getWeather}>Fetch weather forecast now.</button>*/}
            </div>
            <div className="main-wrapper">
                <h3>Top 5 Nyheter</h3>
                <div className="card">
                    {/*{weather === null ? (*/}
                    {/*    <p>Boktitel</p>*/}
                    {/*) : (*/}
                    {/*    weather.map((w, i) => {*/}
                    {/*        return*/}
                    {/*        <div className="card-product">*/}
                    {/*            <div className="book-image"></div>*/}
                    {/*                <p key={i}>{w.name}</p>*/}
                    {/*            </div>;*/}
                    {/*    })*/}
                    {/*)}*/}
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
