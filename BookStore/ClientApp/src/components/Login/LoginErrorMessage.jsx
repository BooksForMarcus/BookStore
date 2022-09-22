import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faFaceSadTear} from "@fortawesome/free-solid-svg-icons";
const LoginErrorMessage = ({ errorState }) => {
  const error = errorState.loginError;

  return (
    <div className="login-error-message-container">
      <div className="login-error-message">
	  	<FontAwesomeIcon icon={faFaceSadTear} />
        <h3>Inloggning misslyckades.</h3>
        {!error.userFound &&<p>Användaren hittades inte.</p>}
		{(error.userFound && !error.validPassword) &&<p>Felaktigt lösenord.</p>}
		{error.isBlocked &&
			<div>
				<p>Användaren är blockerad.</p>
				<p>För mer information <a href="mailto:bookstoreformarcus@outlook.com">kontakta oss.</a></p>
			</div>
		}
      </div>
    </div>
  );
};

export default LoginErrorMessage;
