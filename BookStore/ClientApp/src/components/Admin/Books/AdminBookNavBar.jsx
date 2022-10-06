import { useState } from "react";
import { useEffect } from "react";

const AdminBookNavBar = ({ setLocalBooks, books,setShowAddBook,showAddBook,bookToEdit }) => {
  const [filteredBooks, setFilteredBooks] = useState(books);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

 const updateSearch =  () => {
	if (searchTerm.length > 1) {
		const lowerSearchTerm = searchTerm.toLowerCase();
		const searchedBooks = filteredBooks.filter(
		  (b) =>
			b.title.toLowerCase().includes(lowerSearchTerm) ||
			b.author.toLowerCase().includes(lowerSearchTerm) ||
			b.isbn.toLowerCase().includes(lowerSearchTerm) ||
			b.soldById.toLowerCase().includes(lowerSearchTerm) ||
			b.id.toLowerCase().includes(lowerSearchTerm)
		);
		setLocalBooks(searchedBooks);
	  } else {
		setLocalBooks(filteredBooks);
	  }
 } 
  useEffect(() => {
    updateSearch();
  }, [searchTerm,filteredBooks]);


  useEffect(() => {
    let newBookArr = [];
    switch (filter) {
      case "all":
        newBookArr = books;
        break;
      case "store":
        newBookArr = books.filter((b) => b.soldById === "store");
        break;
      case "customer":
        newBookArr = books.filter((b) => b.soldById !== "store").sort((a, b) => a.soldById.localeCompare(b.soldById));
        break;
      case "soldout":
        newBookArr = books.filter((b) => b.numInstock === 0);
        break;
      default:
        newBookArr = books;
        break;
    }
    setFilteredBooks(newBookArr);
    setLocalBooks(newBookArr);
	updateSearch();
  }, [filter,books]);

  return (
    <div className="admin-book-nav-bar">
      <div className="admin-book-search">
        <label htmlFor="search">Sök böcker</label>
        <input
          type="text"
          id="search"
          placeholder="Sök efter Id, titel, författare, ISBN eller säljare..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value.trimStart())}
        />
      </div>
      <form className="admin-book-filter">
        <fieldset>
          <legend>Filter</legend>
          <label>
            
            <input
              type="radio"
              name="filter"
              value="all"
              checked={filter === "all"}
              onChange={(e) => setFilter(e.target.value)}
            />Alla
          </label>
          <label>
            
            <input
              type="radio"
              name="filter"
              value="store"
              checked={filter === "store"}
              onChange={(e) => setFilter(e.target.value)}
            />Säljs av site
          </label>
          <label>
            
            <input
              type="radio"
              name="filter"
              value="customer"
              checked={filter === "customer"}
              onChange={(e) => setFilter(e.target.value)}
            />Säljs av kund
          </label>
          <label>
            
            <input
              type="radio"
              name="filter"
              value="soldout"
              checked={filter === "soldout"}
              onChange={(e) => setFilter(e.target.value)}
            />Slut i lager
          </label>
        </fieldset>
      </form>
      <button
        onClick={() => {
          setFilter("all");
		  setSearchTerm("");
        }}
		className="btn-admin-book-nav-reset"
      >
        Återställ sökning
      </button>
	  <button className="btn-admin-book-nav-add-book btn-call-to-action" onClick={()=>setShowAddBook(!showAddBook)} disabled={bookToEdit!==null}>
	  {showAddBook?"Stäng":"Lägg till bok"}

	  </button>
    </div>
  );
};

export default AdminBookNavBar;
