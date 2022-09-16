import { decode as base64_decode, encode as base64_encode } from "base-64";

const getBasicAuthString = (email, password) => {
	const baseString = email + ":" + password;
    const base64basicAuth = base64_encode(baseString);
	const basicAuthString = "Basic "+base64basicAuth
	return basicAuthString;
}

export default getBasicAuthString;