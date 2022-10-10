import React, { useState } from 'react'
import "../../App.css";
import { useRecoilValue } from "recoil";
import searchWordState from "../../atoms/searchWordState";
import booksState from "../../atoms/booksState";
import { Link } from "react-router-dom";
import BookCard from '../Books/BookCard';

function SearchResults() {

    const searchWord= useRecoilValue(searchWordState);
	const books = useRecoilValue(booksState);
    let bookresuls = [];
    let authorresults = [];

    if (searchWord.length > 0) {
        books.filter((book) => {
            if (searchWord === "") {
                bookresuls.push(book);
            } else if (book.title.toLowerCase().includes(searchWord.toLowerCase())) {
                bookresuls.push(book);
            } else if (book.author.toLowerCase().includes(searchWord.toLowerCase())) {
                authorresults.push(book);
        }
        })}

    return (
        <div>
            <div>
            {bookresuls.length > 0 ? (
                <div>
                    <h3>
                        Böcker
                    </h3>
			    {bookresuls.map((book) => (
                <BookCard book={book} key={book.id} />
            ))}
        </div>
            ) : null}
        </div>
        
        <div>
            {authorresults.length > 0 ? (
                <div>
                    <h3>
                        Författare
                    </h3>
			    {authorresults.map((book) => (
                <BookCard book={book} key={'Author' + book.id} />
            ))}
        </div>
            ) : null}
        </div>  
        {bookresuls.length === 0 && authorresults.length === 0 ?<h3>Inga träffar</h3> : null}
        </div>
        
		
    )
}
export default SearchResults;