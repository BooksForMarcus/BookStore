import React, { useState } from 'react'
import "../App.css";
import { useRecoilValue } from "recoil";
import searchItemState from "../atoms/searchItemState";


function Result() {

    const book = useRecoilValue(searchItemState);

    //const bookinformation = () => {

    //    return (
    //        bookInfor.map(book => (
    //            <h3>
    //                {book.title}
    //            </h3>
    //            ))
    //        )
    //}

    return (
        <div>
            <h1>Result page</h1>
            {book.title}
            {book.author}
        </div>
    )
}

export default Result;