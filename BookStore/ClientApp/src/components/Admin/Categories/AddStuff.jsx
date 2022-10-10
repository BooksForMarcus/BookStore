import { useState } from "react";
import { useRecoilState } from "recoil";
import loggedInUserState from "../../../atoms/loggedInUserState";

function AddStuff   ({  toggle, setToggle, setAllCategories })  {
    const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);
    const [name, setName] = useState("");
  
    const handleClick = (event, param) => {
 
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
            }).then(updateCats()); 
    };

    async function updateCats() {
        const resp = await fetch("/api/category");
        const json = await resp.json();
        json.sort((a, b) => a.name.localeCompare(b.name));
        setAllCategories(json);
        setToggle(!toggle);
    }

    return (
        <div >
            <div>  <input className="jonas-input3" type="text" onChange={(e) => setName(e.target.value)} /></div>
            <div><button className="jonas-button" onClick={(event => handleClick(event, name))}>Lägg Till</button></div>
        </div>
    );

}
export default AddStuff;