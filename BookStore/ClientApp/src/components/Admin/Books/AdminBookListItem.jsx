const AdminBookListItem = ({book,setBookToEdit}) => {
	return (
		<div className="admin-book-list-item" onClick={()=>setBookToEdit!==undefined?setBookToEdit(book.id):null}>
			<p>{book.isbn}</p>
			<p>{book.title}</p>
			<p>{book.author}</p>
			<p>{book.soldById}</p>
			<p>{book.numInstock}</p>
		</div>
	  );
}

export default AdminBookListItem;