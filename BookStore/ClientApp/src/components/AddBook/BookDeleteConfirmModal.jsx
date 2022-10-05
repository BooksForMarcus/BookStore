import ModalBaseFull from "../Modal/ModalBaseFull";

const BookDeleteConfirmModal = ({deleteBook,setShowDeleteConfirm}) => {
	return ( 
		<ModalBaseFull>
          <div className="modal-card">
            <h3>Är du säker på att du vill ta bort den här boken?</h3>
            <div className="btn-area">
              <button type="button" className="btn-danger" onClick={deleteBook}>
                Ja
              </button>
              <button type="button" onClick={() => setShowDeleteConfirm(false)}>
                Nej
              </button>
            </div>
          </div>
        </ModalBaseFull>
	 );
}

export default BookDeleteConfirmModal;