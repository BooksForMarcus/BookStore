import ModalBaseFull from "../Modal/ModalBaseFull";
const BookUpdatedModal = ({ bookUpdated, setBookUpdated }) => {
  return (
    <ModalBaseFull>
      <div className="modal-card">
        <h3>
          {bookUpdated === "ok"
            ? "Boken har uppdaterats"
            : "Kunde inte uppdatera boken"}
        </h3>
        <button
          type="button"
          onClick={() => setBookUpdated(null)}
          className="btn-call-to-action"
        >
          Ok
        </button>
      </div>
    </ModalBaseFull>
  );
};

export default BookUpdatedModal;
