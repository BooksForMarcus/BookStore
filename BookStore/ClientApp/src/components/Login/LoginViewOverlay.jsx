import LoginErrorMessage from "./LoginErrorMessage";
import CreationErrorMessage from "./CreationErrorMessage";

const LoginInViewOverLay = ({errorState}) => {
	const loginError = errorState.loginError;
	const creationError = errorState.creationError;


	const resetErrorState = () => {
		if(errorState.creationError)errorState.setCreationError(null);
		if(errorState.loginError)errorState.setLoginError(null);
	}

	return (
		<div className="login-view-overlay" onClick={resetErrorState}>
			{loginError && <LoginErrorMessage errorState={errorState}/>}
			{creationError && <CreationErrorMessage errorState={errorState}/>}
		</div>
	  );
}

export default LoginInViewOverLay;