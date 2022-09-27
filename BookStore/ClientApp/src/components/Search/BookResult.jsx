import React, { useState } from 'react'
import "./SearchBar.css";
import { useRecoilValue } from "recoil";
import searchItemState from "../../atoms/searchItemState";
import booksState from "../../atoms/booksState";


function Result() {

    const item = useRecoilValue(searchItemState);
    const books = useRecoilValue(booksState);

	const displayResults = () => {

			return <div>
				{books.filter((book) => {
					if (item.toLowerCase() === book.author.toLowerCase()) {
						return book
					} else if (item.toLowerCase() === book.title.toLowerCase())
						return book

				}).map(book => (
					<div className='dataItem' key={book.id}>
						<h3>{book.title}</h3>
						<h4>{book.author}</h4>
						<h5>{book.price} kr</h5>
						<h6>Säljare: {book.soldBy}</h6>
					</div>
				))}
			</div>
	}

    return (
        <div>
            <h1>Result page</h1>
			{displayResults()}
        </div>
    )
}

export default Result;