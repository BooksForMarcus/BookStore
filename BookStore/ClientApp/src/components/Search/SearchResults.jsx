import React, { useState } from 'react'
import "../../App.css";
import { useRecoilValue } from "recoil";
import searchWordState from "../../atoms/searchWordState";
import booksState from "../../atoms/booksState";
import { Link } from "react-router-dom";

function SearchResults() {

    const searchWord= useRecoilValue(searchWordState);
	const books = useRecoilValue(booksState);

	const displayBooksResults = () => {

		if (searchWord.length > 0) {
			return <div>
			<h3>Titel träffar:</h3>
			<div className='search-result-area'>
				{books.filter((book) => {
					if (searchWord === '') {
						return book
					} else return book.title.toLowerCase().includes(searchWord.toLowerCase())
				}).map(book => (
                    <Link
                        to={`book/${book.id}`}
                        state={book}
                        className="card-product-link" key={book.id}>
                            <div className="card-product-result">
                                <div className="book-image-wrapper">
                                    <img
                                    className="book-img"
                                    src={book.imageURL}
                                    alt="Front image of book"
                                    >
                                    </img>
                                </div>
                                    <span className="card-product-title">{book.title}</span>
                                    <span className="card-product-title">{book.author}</span>
                                    <span className="card-product-price">{book.price} kr</span>
                            </div>
                    </Link>
				))}
			</div>
				
				</div>
			
		}
	}

	const displayAuthorResults = () => {

		if (searchWord.length > 0) {
			return <div>
			<h3>Författar träffar:</h3><div className='search-result-area'>
				{books.filter((book) => {
					if (searchWord === '') {
						return book
					} else return book.author.toLowerCase().includes(searchWord.toLowerCase())
				}).map(book => (
                    <Link
                        to={`book/${book.id}`}
                        state={book}
                        className="card-product-link" key={book.id}>
                            <div className="card-product-result">
                                <div className="book-image-wrapper">
                                    <img
                                    className="book-img"
                                    src={book.imageURL}
                                    alt="Front image of book"
                                    >
                                    </img>
                                </div>
                                    <span className="card-product-title">{book.title}</span>
                                    <span className="card-product-title">{book.author}</span>
                                    <span className="card-product-price">{book.price} kr</span>
                            </div>
                    </Link>
				))}
			</div>
			</div>
		}
	}

    return (
		<div>
			{searchWord !==null ? <div>{displayBooksResults()} {displayAuthorResults()}</div> : <h3>Inga träffar</h3>}
        </div>
    )
}
export default SearchResults;