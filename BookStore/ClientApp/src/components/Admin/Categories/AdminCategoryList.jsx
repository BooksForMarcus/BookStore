import { useRecoilState } from "recoil";
import loggedInUserState from "../../../atoms/loggedInUserState";
import { useState } from "react";
import AdminCategoryListItem from "./AdminCategoryListItem";

const AdminCategoryList = ({ categories, setCategories, toggle, setToggle }) => {
  const [name, setName] = useState("");
  //const [toggle, setToggle] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  var goahead = false;

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
      fetch("/api/category/" + { id } + "", {
        method: "DELETE",
        headers: {
          Authorization: loggedInUser.password,
        },
      });
    }
    const handleClick = (event, param) => {
      setShowDeleteConfirm(false);
      //console.log(event);
      //console.log(param);
      if (true) {
        fetch("/api/book/" + param + "", {
          method: "DELETE",
          headers: {
            Authorization: loggedInUser.password,
          },
        });

        fetch("/api/category/" + param + "", {
          method: "DELETE",
          headers: {
            Authorization: loggedInUser.password,
          },
        });
      }
    };

    const getCategories = async () => {
      const resp = await fetch("/api/category");
      const json = await resp.json();
      json.sort((a, b) => a.name.localeCompare(b.name));
      setCategories(json);
    };

    const handleClick2 = (event, param, param2) => {
      console.log("hejhcl2"+event);
      console.log("param" + param + "param2" + param2);
      fetch("/api/category/", {
        method: "PUT",
        headers: {
          Authorization: loggedInUser.password,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Id: param, Name: param2 }),
      });

      //console.log("error ");
      refresh();
    };

    const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);
    console.log(categories);







    return (
      <div   className="jonas-fult">
        {categories !== null &&
          categories.map((b) => (
              <AdminCategoryListItem key={b.id} category={b} toggle={toggle} setToggle={setToggle}/>
          ))}
        ;
      </div>
    );  
};


export default AdminCategoryList;
