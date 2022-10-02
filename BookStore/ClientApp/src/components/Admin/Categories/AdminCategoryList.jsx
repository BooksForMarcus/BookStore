import { Button } from "@mui/material";
//import { useRecoilState } from "recoil";
//import loggedInUserState from "../../../atoms/loggedInUserState";
 


//const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);

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

var deleteThisCategory=null;

const AdminCategoryList = ({ categories }) => {
    return (
        <div className="admin-category-list">

            {categories !== null &&
                categories.map((b) => <div key={b.id}>{b.name}<button onClick={(b) => fetch("/api/category", {
                    method: "DELETE", headers: {
                        Authorization: loggedInUser.password,
                        Accept: "application/json",
                        "Content-Type": "application/json",},
                    body: JSON.stringify(b),}  )      }>DELETE</button> </div>)}
        </div>
    );
};

export default AdminCategoryList;