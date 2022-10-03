import { Button } from "@mui/material";
import { useRecoilState } from "recoil";
import loggedInUserState from "../../../atoms/loggedInUserState";
import { useState } from "react";
import { useEffect } from "react";
 
 

const AdminCategoryList = ({ categories, setCategories }) => {
 
    const [name, setName] = useState("");
    const [toggle, setToggle] = useState(false);



 

    async function refresh() {

        let resp = await fetch("/api/category");
        if (resp.ok) {


            const json = await resp.json();
            json.sort((a, b) => a.name.localeCompare(b.title));
 
            setCategories(json);
            setToggle(!toggle);
 
        } else {

        }
    }
 

    function fetchDelete(id) {
        fetch('/api/category/' + { id } + '',
            {
                method: "DELETE",
                headers: {
                    Authorization: loggedInUser.password
                }
            })
}
    const handleClick = (event, param) => {
        console.log(event);
        console.log(param);
        fetch('/api/category/' +   param   + '',
            {
                method: "DELETE",
                headers: {
                    Authorization: loggedInUser.password,

                }
            })
 
         
    };

    const getCategories = async () => {
        const resp = await fetch("/api/category");
        const json = await resp.json();
        json.sort((a, b) => a.name.localeCompare(b.name));
        setCategories(json);
    };

    const handleClick2 = (event, param, param2) => {
        console.log(event);
        console.log("param"+param+"param2"+param2);
         fetch('/api/category/' ,
            {
                method: "PUT",
                headers: {
                    Authorization: loggedInUser.password,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({Id: param, Name: param2}),
             })
 
        console.log("error ");
        refresh();
    };
 
    const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);
 
    return (
 
        <div style={{ width: '100%'  }} className="jonas-fult">

            {categories !== null &&
 
                categories.map((b) =>
                    <div className="jonas-tr" key={b.id}>
                        <div>{b.name} </div>
                        <div> <button className="jonas-input" onClick={event => handleClick(event, b.id)}   >DELETE</button></div>
                        {/*<div><input className="jonas-input2" type="text" name={b.id} id={b.id} value={myName} onChange={(e) => setName(e.target.value)} /></div>*/}
                        <div><input className="jonas-input2" type="text" name={b.id} id={b.id}   onChange={(e) => setName(e.target.value)} /></div>
                        <div>  <button className="jonas-input" onClick={event => handleClick2(event, b.id, name)}   >Edit</button></div>
 
                    </div>)
}
        </div>
    );
};

export default AdminCategoryList;