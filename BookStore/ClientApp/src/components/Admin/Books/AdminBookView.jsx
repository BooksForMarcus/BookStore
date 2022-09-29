import { useRecoilState } from "recoil";
import booksState from "../../../atoms/booksState";
import AdminBookList from "./AdminBookList";
import AdminBookEdit from "./AdminBookEdit";
import { useState } from "react";

function AdminBookView() {
  const [books, setBooks] = useRecoilState(booksState);
  const [bookToEdit, setBookToEdit] = useState(null);
  return (
    <div className="admin-book-view">
      <h1>Admin Book View placeholder</h1>
      {bookToEdit === null ? (
        <AdminBookList books={books} setBookToEdit={setBookToEdit} />
      ) : (
        <AdminBookEdit
          books={books}
          setBooks={setBooks}
          book={books.find((b) => b.id === bookToEdit)}
          setBookToEdit={setBookToEdit}
        />
      )}
    </div>
  );
}

export default AdminBookView;
