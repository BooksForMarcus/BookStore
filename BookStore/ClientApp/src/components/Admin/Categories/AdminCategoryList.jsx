import { Button } from "@mui/material";
import { useRecoilState } from "recoil";
import loggedInUserState from "../../../atoms/loggedInUserState";
 


 

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

const AdminCategoryList = ({ categories }) => {

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
                    Authorization: loggedInUser.password
                }
            })
    };
    const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);
    return (
 
        <div className="admin-category-list">

            {categories !== null &&
                //categories.map((b) => <div key={b.id}>{b.id}...{b.name}<button onClick={fetchDelete( b.id )}   >DELETE</button> </div>)
                //categories.map((b) => <div key={b.id}>{b.id}...{b.name}<button onClick={console.log("hej")}   >DELETE</button> </div>)
                categories.map((b) => <div key={b.id}>{b.id}...{b.name}<button onClick={event => handleClick(event, b.id)}   >DELETE</button> </div>)
}
        </div>
    );
};

export default AdminCategoryList;