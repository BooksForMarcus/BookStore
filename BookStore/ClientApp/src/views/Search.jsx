import React, { useState } from 'react'
import "../SearchBar.css";
import {
	BrowserRouter,
	Routes,
	Route,
	Link
} from "react-router-dom";
import { useRecoilValue } from "recoil";
import { useRecoilState } from "recoil";
import searchItemState from "../atoms/searchItemState";
import booksState from "../atoms/booksState";
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';


function Search() {
	const books = useRecoilValue(booksState);
	const [search, setSearch] = useState("");
	const [item, setItem] = useRecoilState(searchItemState);

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
					<div>
						<Link className='dataItem' to='/result' onClick={() => setItem(book)} >
							<p>{book.title}</p>
						</Link>
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
					<div>
						<a className='dataItem'  href="https://www.bokus.com/" >
							<p>{val.author} (Författare)</p>
						</a>
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

export default Search;