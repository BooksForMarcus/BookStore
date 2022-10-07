import { useState } from "react";
 
import { useRecoilState } from "recoil";
import loggedInUserState from "../../../atoms/loggedInUserState";
 
import { useEffect } from "react";
import ModalBaseFull from "../../Modal/ModalBaseFull";
import DeleteConfirm from "./DeleteConfirm";
 

const AdminCategoryListItem = ({ category, toggle, setToggle }) => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);
    const [name, setName] = useState("");
    //const [toggle, setToggle] = useState(false);


    const handleClick2 = (event, param, param2) => {
        console.log(event);
        console.log("param" + param + "param2" + param2);
        fetch('/api/category/',
            {
                method: "PUT",
                headers: {
                    Authorization: loggedInUser.password,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ Id: param, Name: param2 }),
            })

        //console.log("error ");
        //refresh();
    };

 

    return (
 
        <div className="jonas-tr">
            {/*{showDeleteConfirm && (*/}
            {/*    <DeleteConfirm id={category.id} setShowDeleteConfirm={setShowDeleteConfirm} toggle={toggle} setToggle={setToggle}/>*/}
            {/*)*/}
            {/*}*/}

                        <div>{category.name} </div>
                        <div> <button className="jonas-button" onClick={() =>  setShowDeleteConfirm(true) } >Ta Bort</button></div>
 
                        <div>Nytt namn:</div>
                        <div>  <input className="jonas-input2" type="text"    onChange={(e) =>  setName(e.target.value)   } /></div>
            <div>  <button className="jonas-button" onClick={event => handleClick2(event, category.id, name)} >Ändra</button></div>
            {showDeleteConfirm && (
                <DeleteConfirm id={category.id} setShowDeleteConfirm={setShowDeleteConfirm} toggle={toggle} setToggle={setToggle} />
            )
            }
        </div>
        );

}
export default AdminCategoryListItem;