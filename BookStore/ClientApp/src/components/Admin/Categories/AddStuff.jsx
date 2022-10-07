import { useState } from "react";

import { useRecoilState } from "recoil";
import loggedInUserState from "../../../atoms/loggedInUserState";

import { useEffect } from "react";
import ModalBaseFull from "../../Modal/ModalBaseFull";



const AddStuff = ({  toggle, setToggle, setAllCategories }) => {
    //const AdminCategoryListItem = ({   toggle, setToggle, setAllCategories }) => {
 
    const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);
    const [name, setName] = useState("");
    const [localToggle, setLocalToggle] = useState(false);
 


    const handleClick2 = (event, param) => {
 
        //console.log(event);
        //console.log("param" + param );
        //fetch('/api/category/',
        //    {
        //        method: "POST",
        //        headers: {
        //            Authorization: loggedInUser.password,
        //            Accept: "application/json",
        //            "Content-Type": "application/json",
        //        },
        //        body: JSON.stringify({ Name: param }),
        //    }).then(blah());


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


        //const resp = await fetch("/api/category");
        //const json = await resp.json();
        //json.sort((a, b) => a.name.localeCompare(b.name));
        //await setAllCategories(json);
        //setToggle(!toggle) ;
         
        //console.log("blah");
 
        setToggle(!toggle);
        const resp = await fetch("/api/category");
        const json = await resp.json();
        json.sort((a, b) => a.name.localeCompare(b.name));
        setAllCategories(json);
        console.log("blah");
    }



    return (

        <div  >
      
            {/*<label htmlFor="CategoryName">Kategorinamn: </label>*/}
            {/*<input className="jonas-input3"*/}
            {/*    width="20em"*/}
            {/*    type="text"*/}
            {/*    name="name"*/}
            {/*    id="name"*/}
            {/*    value={name}*/}
            {/*    onChange={(e) => setName(e.target.value)}*/}
            {/*/>*/}

            <div>  <input className="jonas-input3" type="text" onChange={(e) => setName(e.target.value)} /></div>
{/*            <div>  <button className="jonas-button" onClick={event => handleClick2(event, category.id, name)} >Ändra</button></div>*/}

            <div><button className="jonas-button" onClick={(event => handleClick2(event, name))}>Addstuff</button></div>
        </div>
    );

}
export default AddStuff;