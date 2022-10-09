import { useState } from "react";
import { useEffect } from "react";

import { useRecoilState } from "recoil";
import loggedInUserState from "../../../atoms/loggedInUserState";

import ModalBaseFull from "../../Modal/ModalBaseFull";



//const AddStuff = ({  toggle, setToggle, setAllCategories }) => {
function AddStuff   ({  toggle, setToggle, setAllCategories })  {
    const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);
    const [name, setName] = useState("");
    const [localToggle, setLocalToggle] = useState(false);
 
    //useEffect(() => {
    //    //if (allCategories === null) getCategories();
    //    getCategories();
    //}, []);

    const handleClick2 = (event, param) => {
 



        setToggle(!toggle);
        console.log(event);
        console.log("param" + param);
        fetch('/api/category/',
            {
                method: "POST",
                headers: {
                    Authorization: loggedInUser.password,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ Name: param }),
            }).then(blah());
        //setToggle(!toggle);
 
    };

    async function blah() {
        setToggle(!toggle);
        const resp = await fetch("/api/category");
        const json = await resp.json();
        json.sort((a, b) => a.name.localeCompare(b.name));
        setAllCategories(json);
        console.log("blah");
        setToggle(!toggle);
    }



    return (

        <div >
            <div>  <input className="jonas-input3" type="text" onChange={(e) => setName(e.target.value)} /></div>
            <div><button className="jonas-button" onClick={(event => handleClick2(event, name))}>Addstuff</button></div>
        </div>
    );

}
export default AddStuff;