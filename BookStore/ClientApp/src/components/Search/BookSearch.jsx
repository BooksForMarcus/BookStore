import React, { useState } from 'react'
import "./SearchBar.css";
import { useRecoilValue } from "recoil";
import booksState from "../../atoms/booksState";
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';


function BookSearch() {
	const books = useRecoilValue(booksState);
	const [search, setSearch] = useState("");
	const [authorResult, setAutorResult] = useState([]);

	const displayTitleResults = () => {
		if (search.length > 0) {
			
			
			return <div>
				{books.filter((book) => {
					if (search === '') {
						return book
					} else if (book.title.toLowerCase().includes(search.toLowerCase())) {
						return book.title[0].toLowerCase().includes(search[0].toLowerCase())
					}
				}).map(book => (
					<div className='dataItem'>
						<p>{book.title}</p>
					</div>
				))}
				   </div>
			}
		}

	const displayAuthorResults = () => {

		if (search.length > 0) {
			return <div>
				{books.filter((val) => {
					if (search === '') {
						return val
					} else if (val.author.toLowerCase().includes(search.toLowerCase())) {
						return val.author[0].toLowerCase().includes(search[0].toLowerCase())
					}
				}).map(val => (
					<div className='dataItem'>
						<p>{val.author} : (författare)</p>
					</div>
				))}
			</div>
		}
	}

		const isResults = () => {
			if (search.length > 0){
				return (
					<div className='dataResult'>{displayTitleResults()} {displayAuthorResults()}</div>)
			} else return (
				<div>{displayTitleResults()}</div>)
	}

		const clearSearchBar = () => {
			return setSearch('')
		}
	

	return (
		<div>
		<div className='search'>
			<div className='searchInputs'>
				<input type="text"
					onChange={(event) => setSearch(event.target.value)}
					placeholder="search.." value={search} />
				<div className='closeIcon'>
					{search.length != 0 ? <CloseIcon onClick={clearSearchBar} /> : null}
				</div>
				<div className='searchIcon'>
						<SearchIcon />
				</div>
			</div>
			<div>{isResults()}</div>
			</div>
			
		</div>
    );

}

export default BookSearch;