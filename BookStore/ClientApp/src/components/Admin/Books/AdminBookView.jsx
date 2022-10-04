import { useRecoilState } from "recoil";
import booksState from "../../../atoms/booksState";
import AdminBookList from "./AdminBookList";
import { useState,useEffect } from "react";
import BookCrud from "../../AddBook/BookCrud";
import AdminBookNavBar from "./AdminBookNavBar";


function AdminBookView() {
  const [books, setBooks] = useRecoilState(booksState);
  const [localBooks, setLocalBooks] = useState(books);
  const [bookToEdit, setBookToEdit] = useState(null);
  const [showAddBook, setShowAddBook] = useState(false);

  useEffect(() => {
	setLocalBooks(books);
  }, [books]);

  return (
    <div className="admin-book-view">
      <AdminBookNavBar
        localBooks={localBooks}
        setLocalBooks={setLocalBooks}
        books={books}
        showAddBook={showAddBook}
        setShowAddBook={setShowAddBook}
        bookToEdit={bookToEdit}
      />
      {bookToEdit === null && showAddBook && <BookCrud isEdit={false} />}
      {bookToEdit === null && !showAddBook && (
        <AdminBookList books={localBooks} setBookToEdit={setBookToEdit} />
      )}
      {bookToEdit !== null && !showAddBook && (
        <BookCrud
          isEdit={true}
          book={books.find((b) => b.id === bookToEdit)}
          setBookToEdit={setBookToEdit}
        />
      )}
    </div>
  );
}

export default AdminBookView;
