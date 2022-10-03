import { Button } from "@mui/material";
import { useRecoilState } from "recoil";
import loggedInUserState from "../../../atoms/loggedInUserState";
import { useState } from "react";
import { useEffect } from "react";
 


 

//const requestOptionsDelete = {
//    method: "DELETE",
//    headers: {
        //Authorization: loggedInUser.password,
        //Accept: "application/json",
        //"Content-Type": "application/json",
//    },
//    body: JSON.stringify(deleteThisCategory),
//};

//function deletion(spaghettiStrand)
//{
//    deleteThisCategory = spaghettiStrand;
//    fetch("/api/category", requestOptionsDelete);
//}
// body: JSON.stringify({ id: b.id, name: b.name } ),}  )      }>DELETE</button> </div>)}
//var deleteThisCategory=null;

//function fetchDelete(id){
//    fetch('/api/category/' + id + '' ,
//        {
//            method: "DELETE",
//            headers: {
//                Authorization: loggedInUser.password
//            }
//        }
//}

const AdminCategoryList = ({ categories, setCategories }) => {
    const [name, setName] = useState("");
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
        //setCategories(getCategories);

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
        //setCategories(getCategories)
        console.log("error ");
    };

    const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);
    return (
 
        <div style={{ width: '100%'  }} className="jonas-fult">

            {categories !== null &&
                //categories.map((b) => <div key={b.id}>{b.id}...{b.name}<button onClick={fetchDelete( b.id )}   >DELETE</button> </div>)
                //categories.map((b) => <div key={b.id}>{b.id}...{b.name}<button onClick={console.log("hej")}   >DELETE</button> </div>)
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