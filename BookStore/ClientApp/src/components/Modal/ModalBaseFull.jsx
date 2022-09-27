import "./modal.css";

const ModalBaseFull = (props) => {
	return (  
		<div className="modal-underlay">
			{props.children}
		</div>
	);
}

export default ModalBaseFull;