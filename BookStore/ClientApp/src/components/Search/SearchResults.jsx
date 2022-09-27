import React, { useState } from 'react'
import "./SearchBar.css";
import { useRecoilValue } from "recoil";
import searchWordState from "../../atoms/searchWordState";
import booksState from "../../atoms/booksState";

function SearchResults() {

    const searchWord= useRecoilValue(searchWordState);
	const books = useRecoilValue(booksState);

	const displayBooksResults = () => {

		if (searchWord.length > 0) {
			return <div>
				{books.filter((book) => {
					if (searchWord === '') {
						return book
					} else return book.title[0].toLowerCase().includes(searchWord[0].toLowerCase())
						
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
	}

	const displayAuthorResults = () => {

		if (searchWord.length > 0) {
			return <div>
				{books.filter((val) => {
					if (searchWord === '') {
						return val
					} else return val.author[0].toLowerCase().includes(searchWord[0].toLowerCase())
				}).map(val => (
					<div className='dataItem' key={val.id}>
						<h3>{val.title}</h3>
						<h4>{val.author}</h4>
						<h5>{val.price} kr</h5>
						<h6>Säljare: {val.soldBy}</h6>
					</div>
				))}
			</div >
		}
	}

    return (
		<div>
			<h1>Result page</h1>
			{searchWord.length > 0 ? <div>{displayBooksResults()} {displayAuthorResults()}</div> : <h3>Inga träffar</h3>}
        </div>
    )
}

export default SearchResults;