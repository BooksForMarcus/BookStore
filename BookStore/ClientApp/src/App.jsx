import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { useRecoilState } from "recoil";
import weatherState from "./atoms/weatherState";

function App() {
    const [count, setCount] = useState(0);
    const [weather, setWeather] = useRecoilState(weatherState);

    const getWeather = async () => {
        const resp = await fetch("/api/weatherforecast");
        const json = await resp.json();
        console.log(json);
        setWeather(json);
    };

    return (
        <div className="App">
            <header></header>
            <main>
                <div className="side"></div>
                <div>
                    <div className="card">
                        <h3>Top 5 Nyheter</h3>
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
                    <div className="card">
                        <h3>Top 5 Begagnat</h3>
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
                    <div className="card">
                        <h3>Hitta något nytt!</h3>
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
            <footer>
                {/*<button onClick={() => setCount((count) => count + 1)}>*/}
                {/*    count is {count}*/}
                {/*</button>*/}
                <button onClick={getWeather}>Fetch weather forecast now.</button>
            </footer>
        </div>
    );
}

export default App;