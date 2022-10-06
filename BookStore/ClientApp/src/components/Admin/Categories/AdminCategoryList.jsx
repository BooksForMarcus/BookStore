
import { useRecoilState } from "recoil";
import loggedInUserState from "../../../atoms/loggedInUserState";
import { useState } from "react";
import { useEffect } from "react";
import ModalBaseFull from "../../Modal/ModalBaseFull";

import deleteImg from "../../../assets/delete.png";
import editImg from "../../../assets/edit.png";

import AdminCategoryListItem from "./AdminCategoryListItem"


const AdminCategoryList = ({ categories, setCategories }) => {
  const [name, setName] = useState("");
  const [toggle, setToggle] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  var goahead = false;
  //

  async function refresh() {
    let resp = await fetch("/api/category");
    if (resp.ok) {
      const json = await resp.json();
      json.sort((a, b) => a.name.localeCompare(b.title));

      setCategories(json);
      setToggle(!toggle);
    } else {
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

                categories.map((b) => (

                    <AdminCategoryListItem key={b.id} category={b} />



                ))};

                     {/*<div className="jonas-tr" key={b.id}>*/}
                     {/*    <div>{b.name} </div>*/}


                        {/*<NavLink className="nav_logo" to="/"><img className="nav_logo" src={logo} alt="An image of bookstore logo" /></NavLink>*/}


                        {/*{showDeleteConfirm && (*/}
                        {/*    <ModalBaseFull>*/}
                        {/*        <div className="modal-card">*/}
                        {/*            <h3>Är du säker på att du vill ta bort den här kategorin?</h3>*/}
                        {/*            <div className="btn-area">*/}
                        {/*                <button type="button" className="btn-danger" onClick={event => handleClick(event, b.id)}>*/}
                        {/*                    Ja*/}

                        {/*                </button>*/}
                        {/*                <button type="button" onClick={() => setShowDeleteConfirm(false)}>*/}
                        {/*                    Nej*/}
                        {/*                </button>*/}
                        {/*            </div>*/}
                        {/*        </div>*/}
                        {/*    </ModalBaseFull>*/}
                        {/*)}*/}




                        {/*<div> <button className="jonas-button" onClick={() => setShowDeleteConfirm(true)} >Ta Bort</button></div>*/}
                        {/*<div><input className="jonas-input2" type="text" name={b.id} id={b.id} value={myName} onChange={(e) => setName(e.target.value)} /></div>*/}
                        {/*<div>Nytt namn:</div>*/}
                        {/*<div> <input className="jonas-input2" type="text" name={b.id} id={b.id} onChange={(e) => setName(e.target.value)} /></div>*/}
                        {/*<div>  <button className="jonas-button" onClick={event => handleClick2(event, b.id, name)} >Ändra</button></div>*/}
 
                     
        )

           </div> 
    );

 
};

export default AdminCategoryList;
