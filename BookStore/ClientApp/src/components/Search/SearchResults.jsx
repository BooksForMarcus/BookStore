import React, { useState } from 'react'
import"./SearchBar.css";
import { useRecoilValue } from "recoil";
import searchWordState from "../../atoms/searchWordState";
import booksState from "../../atoms/booksState";
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
            {bookresuls.length > 0 ? (
                <div>
                    <h3>
                        Sökningen "{searchWord}" gav {bookresuls.length} träffar i böckerna
                    </h3>
                        <div className='search-result'>
                            {bookresuls.map((book) => (
                            <BookCard book={book} key={book.id} />
                         ))}
                        </div>
                </div>
            ) : null}
        
            {authorresults.length > 0 ? (
                <div>
                    <h3>
                        Sökningen "{searchWord}" gav {authorresults.length} träffar i författarna
                    </h3>
                        <div className='search-result'
                        >
                            {authorresults.map((book) => (
                            <BookCard book={book} key={'Author' + book.id} />
                            ))}
                        </div>
                </div>
            ) : null}
        {bookresuls.length === 0 && authorresults.length === 0 ?<h3>Sökningen gav inga träffar</h3> : null}
        </div>
    )
}
export default SearchResults;