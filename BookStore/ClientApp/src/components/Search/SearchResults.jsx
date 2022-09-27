import React, { useState } from 'react'
import "../../App.css";
import { useRecoilValue } from "recoil";
import searchWordState from "../../atoms/searchWordState";
import booksState from "../../atoms/booksState";
import logo from '../../assets/boklogo.png'

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
                    <div className="main-container">
                        <div className="side"></div>
                        <div className="bookView-main-wrapper" key={book.id}>
                            {!book.imageURL ?
                                <div className="bookView-image-wrapper">
                                    <h4>Bild</h4>
                                </div> :
                                <div className="bookView-image-wrapper">
                                    <img
                                        className="bookView-img"
                                        src={book.imageURL}
                                        alt="Front image of book"
                                    >
                                    </img>
                                </div>
                            }
                            <div>
                                <h1 className="bookview-title">{book.title}</h1>
                                <h2 className="bookview-author">av {book.author}</h2>
                                <div className="book-info-wrapper">
                                    <div className="book-info-l">
                                        <p className="book-info">Utgivningsår:</p>
                                        <p className="book-info">Språk:</p>
                                        <p className="book-info">Antal sidor:</p>
                                        <p className="book-info">Vikt:</p>
                                        <p className="book-info">ISBN:</p>
                                    </div>
                                    <div className="book-info-l">
                                        <p className="book-info">{book.year}</p>
                                        <p className="book-info">{book.language}</p>
                                        <p className="book-info">{book.pages} st</p>
                                        <p className="book-info">{book.weight} gram</p>
                                        <p className="book-info">{book.isbn}</p>
                                    </div>
                                    <div className="book-info-r">
                                        <span className="book-info-seller">SÄLJS AV</span>
                                        {book.soldById != "store" ?
                                            <span className="book-info">{book.soldById}</span>
                                            :
                                            <img className="store_logo" src={logo} alt="An image of bookstore logo" />
                                        }
                                        <span className="book-info-price">{book.price} kr</span>
                                        <button disabled>Lägg i varukorgen</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
				))}
			</div>
		}
	}

	const displayAuthorResults = () => {

		if (searchWord.length > 0) {
			return <div>
				{books.filter((book) => {
					if (searchWord === '') {
						return book
					} else return book.author[0].toLowerCase().includes(searchWord[0].toLowerCase())
				}).map(book => (
                    <div className="main-container">
                        <div className="side"></div>
                        <div className="bookView-main-wrapper" key={book.id}>
                            {!book.imageURL ?
                                <div className="bookView-image-wrapper">
                                    <h4>Bild</h4>
                                </div> :
                                <div className="bookView-image-wrapper">
                                    <img
                                        className="bookView-img"
                                        src={book.imageURL}
                                        alt="Front image of book"
                                    >
                                    </img>
                                </div>
                            }
                            <div>
                                <h1 className="bookview-title">{book.title}</h1>
                                <h2 className="bookview-author">av {book.author}</h2>
                                <div className="book-info-wrapper">
                                    <div className="book-info-l">
                                        <p className="book-info">Utgivningsår:</p>
                                        <p className="book-info">Språk:</p>
                                        <p className="book-info">Antal sidor:</p>
                                        <p className="book-info">Vikt:</p>
                                        <p className="book-info">ISBN:</p>
                                    </div>
                                    <div className="book-info-l">
                                        <p className="book-info">{book.year}</p>
                                        <p className="book-info">{book.language}</p>
                                        <p className="book-info">{book.pages} st</p>
                                        <p className="book-info">{book.weight} gram</p>
                                        <p className="book-info">{book.isbn}</p>
                                    </div>
                                    <div className="book-info-r">
                                        <span className="book-info-seller">SÄLJS AV</span>
                                        {book.soldById != "store" ?
                                            <span className="book-info">{book.soldById}</span>
                                            :
                                            <img className="store_logo" src={logo} alt="An image of bookstore logo" />
                                        }
                                        <span className="book-info-price">{book.price} kr</span>
                                        <button disabled>Lägg i varukorgen</button>
                                    </div>
                                </div>
                            </div>
                        </div>
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