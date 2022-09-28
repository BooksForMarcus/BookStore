import ModalBaseFull from "../Modal/ModalBaseFull";
import { useState } from "react";

const ForgottenPasswordModal = ({setShowForgotPassword}) => {
	const [email, setEmail] = useState("");
	const [error,setError] = useState("");

	const requestNewPassword = async (e) => {
		console.log("request new password");
		e.preventDefault();
		const requestOptions = {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email: email }),
		};
		console.log(requestOptions)
		let resp = await fetch("/api/customer/forgotpassword", requestOptions);
		if (resp.ok) {
			console.log(resp)
			try {
				let json = await resp.json();
				console.log(json);
			} catch (error) {
				console.log(error);
			}
			setShowForgotPassword(false);
		} else {
			setError((<p>Kunde inte återställa lösenord,<br></br> kontrollera att du har skrivit in rätt email.</p>));
		}
	}
	
	return (
		<ModalBaseFull>
			<div className="modal-card">
				<h2 className="modal-card-header">Ange din mail adress:</h2>
				<div className="modal-card-body">
					<form onSubmit={requestNewPassword}>
						<input type="email" placeholder="Email" required onChange={(e)=>{setError("");setEmail(e.target.value)}}></input>
						<div className="">
							<button type="submit" className="btn-call-to-action">Skicka</button>
							<button type="button" onClick={(e) =>{setShowForgotPassword(false)}}>Stäng</button>
						</div>
					</form>
				</div>
				<div className="modal-card-footer">
					{error!=="" && <span>{error}</span>}
				</div>
			</div>
		</ModalBaseFull>
	  );
}

export default ForgottenPasswordModal;