import { useState } from "react";

import { useRecoilState } from "recoil";
 
import loggedInUserState from "../../../atoms/loggedInUserState";

import { useEffect } from "react";
import ModalBaseFull from "../../Modal/ModalBaseFull";
import categoriesState from "../../../atoms/categoriesState";



const DeleteConfirm = ({ id, setShowDeleteConfirm, toggle, setToggle }) => {
    const [allCategories, setAllCategories] = useRecoilState(categoriesState);
    const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);
    const [name, setName] = useState("");
/*    const [toggle, setToggle] = useState(false);*/

    const handleClick = (event, param) => {
        setShowDeleteConfirm(false);
        console.log(event);
        console.log(param);
        if (true) {
            setToggle(!toggle);
            fetch('/api/book/' + param + '',
                {
                    method: "DELETE",
                    headers: {
                        Authorization: loggedInUser.password,

                    }
                })


            fetch('/api/category/' + param + '',
                {
                    method: "DELETE",
                    headers: {
                        Authorization: loggedInUser.password,

                    }
                }).then(blah());
            //blah();
        }


    };

    async function blah() {
 
        const resp = await fetch("/api/category");
        const json = await resp.json();
        json.sort((a, b) => a.name.localeCompare(b.name));
        setAllCategories(json);
        console.log("blah");
    }



    return (

        <ModalBaseFull> 
                        {        <div className="modal-card"> 
                <h3>Är du säker på att du vill ta bort den här kategorin?</h3> 
                <div className="btn-area"> 
                    <button type="button" className="btn-danger" onClick={event => handleClick(event,   id )}>
                        Ja 

                    </button> 
                    <button type="button" onClick={() => setShowDeleteConfirm(false)}> 
                        Nej 
                    </button> 
                </div> 
            </div> }
        </ModalBaseFull> 
    );

}
export default DeleteConfirm;