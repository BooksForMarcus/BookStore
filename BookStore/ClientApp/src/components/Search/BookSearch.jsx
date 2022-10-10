import React, { useState } from "react";
import "./SearchBar.css";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { useRecoilState } from "recoil";
import booksState from "../../atoms/booksState";
import searchWordState from "../../atoms/searchWordState";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

function BookSearch() {
  const loc = useLocation();
  const navigate = useNavigate();
  const books = useRecoilValue(booksState);
  const [search, setSearch] = useState("");
  const [searchWord, setSearchWord] = useRecoilState(searchWordState);

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
                  <Link
                    className="dataItem"
                    to={`book/${book.id}`}
                    state={book}
                    onClick={() => clearSearchBar()}>
                    <div>
                      <p>{book.title}: Begagnad</p>
                    </div>
                  </Link>
                ) : (
                  <Link
                  className="dataItem"
                  to={`book/${book.id}`}
                  state={book}
                  onClick={() => clearSearchBar()}>
                  <div>
                    <p>{book.title}</p>
                  </div>
                </Link>
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
        <div className="search-bar">
          {books
            .filter((book) => {
              if (search === "") {
                return book;
              } else if (!authorResult.includes(book.author)) {
                authorResult.push(book.author);

                return book.author.toLowerCase().includes(search.toLowerCase());
              }
            })
            .map((book) => (
              <div className="dataItem" key={book.id}>
                <NavLink
                  className="dataItem"
                  to="/search_result"
                  onClick={() => setSearchWord(book.author) + clearSearchBar()}>
                  <div>
                    <p>{book.author}: författare</p>
                  </div>
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
            onKeyDown={(event) => {
              if(event.key === "Enter") {
              setSearchWord(search);
            clearSearchBar();
            if(loc.pathname.split("/")[1] !== "search_result") {
              navigate("/search_result");
            }
          }
        if(event.key === "Escape") {
          setSearch("");
          }
        }
      }
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
