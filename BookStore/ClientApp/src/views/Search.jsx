import React, { useState, useEffect } from 'react'
import "../App.css";
import { useRecoilState } from "recoil";
import booksState from "../atoms/booksState";



function Search() {
	const [book, setBook] = useState([]);
	const [search, setSearch] = useState("");

	const getBooks = async () => {
		const resp = await fetch("/api/Book");
		const json = await resp.json();
		console.log(json);
		setBook(json);
	};

	useEffect(() => {
		getBooks()
	}, []);


	const displayResults = () => {
		if (search.length > 0) {
			
			
			return <div>
				{book.filter((val) => {
					if (search === '') {
						return val
					} else if (val.title.toLowerCase().includes(search.toLowerCase())) {
						return val.title[0].toLowerCase().includes(search[0].toLowerCase())
					} 
				}).map(val => (
					<div>
						<h3>
							{val.title}
						</h3>
					</div>
				))}
				   </div>
			}
		}

	return (

		<div>
			<div className='searchbar'>
				<input className='search'
					onChange={(event) => setSearch(event.target.value)}
					placeholder="search.." />
			</div>
				{displayResults()}
		</div>
    );

}

export default Search;