import { atom } from "recoil";

const searchWordState = atom({
	key: 'searchWordState',
	default: ''
})

export default searchWordState