import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faFaceSadTear} from "@fortawesome/free-solid-svg-icons";
const CreationErrorMessage = ({ errorState }) => {
  const error = errorState.creationError;

  return (
    <div className="creation-error-message-container">
      <div className="creation-error-message">
	  	<FontAwesomeIcon icon={faFaceSadTear} />
        <h3>Kunde inte skapa kontot.</h3>
		<ul>
			{!error.mailAvailable && <li>Konto med den mail adressen finns redan.</li>}
			{!error.validMail && <li>Angivna mail addressen verkar inte vara giltig.</li>}
			{!error.validFirstName && <li>Angivna förnamnet är oväntat.<br></br>(Förväntat är 2-35 tecken, börja på bokstav, innehålla bara bokstäver, - och ', )</li>}
			{!error.validLastName && <li>Angivna efternamnet är oväntat.<br></br>(Förväntat är 2-35 tecken, börja på bokstav, innehålla bara bokstäver, - och ', )</li>}
		</ul>
      </div>
    </div>
  );
};

export default CreationErrorMessage;
