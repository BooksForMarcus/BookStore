import { atom } from "recoil";

const loggedInUserState = atom({
	key: 'loggedInUserState',
	default: null
})

export default loggedInUserState