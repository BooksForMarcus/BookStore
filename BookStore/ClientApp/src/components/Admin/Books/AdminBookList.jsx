
import AdminBookListItem from "./AdminBookListItem";

const AdminBookList = ({books,setBookToEdit}) => {
  return (
    <div className="admin-book-list">
      <header className="admin-book-list-item">
        <h3>ISBN</h3>
        <h3>Titel</h3>
        <h3>Författare</h3>
        <h3>Säljare</h3>
        <h3>I lager</h3>
      </header>
      {books !== null &&
        books.map((b) => <AdminBookListItem book={b} setBookToEdit={setBookToEdit}/>)}
    </div>
  );
};

export default AdminBookList;
