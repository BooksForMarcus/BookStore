import React, { useState } from "react";
import "./SearchBar.css";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { useRecoilState } from "recoil";
import booksState from "../../atoms/booksState";
import searchWordState from "../../atoms/searchWordState";
import searchItemState from "../../atoms/searchItemState";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

function BookSearch() {
  const books = useRecoilValue(booksState);
  const [search, setSearch] = useState("");
  const [searchWord, setSearchWord] = useRecoilState(searchWordState);
  const [item, setItem] = useRecoilState(searchItemState);

  const displayTitleResults = () => {
    if (search.length > 0) {
      return (
        <div>
          {books
            .filter((book) => {
              if (search === "") {
                return book;
              } else
                return book.title.toLowerCase().includes(search.toLowerCase());
            })
            .map((book) => (
              <div className="dataItem" key={book.id}>
                {book.soldById === "kund" ? (
                  <NavLink
                    className="dataItem"
                    to="/search_book"
                    onClick={() => setItem(book.title) + clearSearchBar()}
                  >
                    <p>{book.title}: begagnad</p>
                  </NavLink>
                ) : (
                  <NavLink
                    className="dataItem"
                    to="/search_book"
                    onClick={() => setItem(book.title) + clearSearchBar()}
                  >
                    <p>{book.title}</p>
                  </NavLink>
                )}
              </div>
            ))}
        </div>
      );
    }
  };

  const displayAuthorResults = () => {
    var authorResult = [];

    if (search.length > 0) {
      return (
        <div>
          {books
            .filter((val) => {
              if (search === "") {
                return val;
              } else if (!authorResult.includes(val.author)) {
                authorResult.push(val.author);

                return val.author.toLowerCase().includes(search.toLowerCase());
              }
            })
            .map((val) => (
              <div className="dataItem" key={val.id}>
                <NavLink
                  className="dataItem"
                  to="/search_book"
                  onClick={() => setItem(val.author) + clearSearchBar()}
                >
                  <p>{val.author} : (författare)</p>
                </NavLink>
              </div>
            ))}
        </div>
      );
    }
  };

  const isResults = () => {
    if (search.length > 0) {
      return (
        <div className="dataResult">
          {displayTitleResults()} {displayAuthorResults()}
        </div>
      );
    } else return <div>{displayTitleResults()}</div>;
  };

  const clearSearchBar = () => {
    return setSearch("");
  };

  return (
    <div>
      <div className="search">
        <div className="searchInputs">
          <input
            type="text"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Sök.."
            value={search}
          />
          <div className="closeIcon">
            {search.length != 0 ? (
              <CloseIcon onClick={() => clearSearchBar()} />
            ) : null}
          </div>
          <NavLink
            className="searchIcon"
            to="/search_result"
            onClick={() => setSearchWord(search) + clearSearchBar()}
          >
            <SearchIcon />
          </NavLink>
        </div>
        <div>{isResults()}</div>
      </div>
    </div>
  );
}

export default BookSearch;
