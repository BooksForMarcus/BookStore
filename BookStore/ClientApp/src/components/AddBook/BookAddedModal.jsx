import ModalBaseFull from "../Modal/ModalBaseFull";
const BookAddedModal = ({bookCreated,setBookCreated}) => {
	return ( <ModalBaseFull>
		<div className="modal-card">
		  <h3>
			{bookCreated === "ok"
			  ? "Boken har lagts till"
			  : "Kunde inte lägga till boken"}
		  </h3>
		  <button
			type="button"
			onClick={() => setBookCreated(null)}
			className="btn-call-to-action"
		  >
			Ok
		  </button>
		</div>
	  </ModalBaseFull> );
}

export default BookAddedModal;