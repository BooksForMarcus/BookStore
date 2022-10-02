import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useRecoilState } from "recoil";
import CategoryListItem from "../../ManageBooks/CategoryListItem";
import UpdateFailed from "../UpdateFailed";
import UpdateOk from "../UpdateOk";
import loggedInUserState from "../../../atoms/loggedInUserState";
import EditCategories from "../../ManageBooks/EditCategories";

const AdminBookEdit = ({ books, setBooks, book, setBookToEdit }) => {
  const [user, setUser] = useRecoilState(loggedInUserState);
  const [categories, setCategories] = useState(book.categories);
  const [title, setTitle] = useState(book.title);
  const [author, setAuthor] = useState(book.author);
  const [isbn, setIsbn] = useState(book.isbn);
  const [numInstock, setNumInstock] = useState(book.numInstock);
  const [soldById, setSoldById] = useState(book.soldById);
  const [price, setPrice] = useState(book.price);
  const [language, setLanguage] = useState(book.language);
  const [weight, setWeight] = useState(book.weight);
  const [pages, setPages] = useState(book.pages);
  const [imgUrl, setImgUrl] = useState(book.imageURL);
  const [updateOk, setUpdateOk] = useState(null);

  const updateBook = async (e) => {
    e.preventDefault();
    const updatedBook = {
      ...book,
      title,
      author,
      isbn,
      numInstock,
      soldById,
      price,
      language,
      weight,
      pages,
      imageURL: imgUrl,
      categories,
    };
    const requestOptions = {
      method: "PUT",
      headers: {
        Authorization: user.password,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedBook),
    };

    let resp = await fetch("/api/book", requestOptions);
    if (resp.ok) {
      let json = await resp.json();
      setUpdateOk(true);
      var newBooks = books.filter((b) => b.id !== updatedBook.id);
      newBooks.push(updatedBook);
      newBooks.sort((a, b) => a.title.localeCompare(b.title));
      setBooks(newBooks);
    } else {
      setUpdateOk(false);
    }
  };

  return (
    <div className="admin-book-edit">
      <h3>{title}</h3>
      <form onSubmit={updateBook} className="admin-book-edit-container">
        <div>
          <label htmlFor="author">Titel</label>
          <input
            type="text"
            name="title"
            id="title"
            value={title}
            required
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <EditCategories categories={categories} setCategories={setCategories} />
        <div>
          <label htmlFor="author">Författare</label>
          <input
            type="text"
            name="author"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="isbn">ISBN</label>
          <input
            type="text"
            name="isbn"
            id="isbn"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="numInstock">I lager</label>
          <input
            type="number"
            name="numInstock"
            id="numInstock"
            value={numInstock}
            onChange={(e) => setNumInstock(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="soldById">Säljare</label>
          <input
            type="text"
            name="soldById"
            id="soldById"
            value={soldById}
            onChange={(e) => setSoldById(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="price">Pris</label>
          <input
            type="number"
            name="price"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="language">Språk</label>
          <input
            type="text"
            name="language"
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="weight">Vikt (i gram)</label>
          <input
            type="number"
            name="weight"
            id="weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="pages">Antal sidor</label>
          <input
            type="number"
            name="pages"
            id="pages"
            value={pages}
            onChange={(e) => setPages(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="imgUrl">Bild URL</label>
          <input
            type="text"
            name="imgUrl"
            id="imgUrl"
            value={imgUrl}
            onChange={(e) => setImgUrl(e.target.value)}
          />
        </div>
        <div className="admin-book-edit-container-btn-area">
          <button type="submit">Uppdatera</button>
          <button type="button" onClick={() => setBookToEdit(null)}>
            Stäng
          </button>
        </div>
      </form>
      {updateOk === true && <UpdateOk />}
      {updateOk === false && <UpdateFailed />}
    </div>
  );
};

export default AdminBookEdit;
