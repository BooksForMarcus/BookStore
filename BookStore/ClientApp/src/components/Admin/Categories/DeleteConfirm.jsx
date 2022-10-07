import { useState } from "react";

import { useRecoilState } from "recoil";
import loggedInUserState from "../../../atoms/loggedInUserState";

import { useEffect } from "react";
import ModalBaseFull from "../../Modal/ModalBaseFull";



const DeleteConfirm = ({ id, setShowDeleteConfirm }) => {
 
    const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);
    const [name, setName] = useState("");
    const [toggle, setToggle] = useState(false);

    const handleClick = (event, param) => {
        setShowDeleteConfirm(false);
        console.log(event);
        console.log(param);
        if (true) {
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
                })

        }


    };
 



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