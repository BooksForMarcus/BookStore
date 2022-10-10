import { useState } from "react";
import { useRecoilState } from "recoil";
import loggedInUserState from "../../../atoms/loggedInUserState";
import ModalBaseFull from "../../Modal/ModalBaseFull";
import categoriesState from "../../../atoms/categoriesState";

const DeleteConfirm = ({ id, setShowDeleteConfirm,setCategoryToDeleteId}) => {
  const [allCategories, setAllCategories] = useRecoilState(categoriesState);
  const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);
  const [name, setName] = useState("");

  const handleClick = async (id) => {
    setShowDeleteConfirm(false);

    
    fetch("/api/book/" + id + "", {
      method: "DELETE",
      headers: {
        Authorization: loggedInUser.password,
      },
    });

    let resp = await fetch("/api/category/" + id + "", {
      method: "DELETE",
      headers: {
        Authorization: loggedInUser.password,
      },
    });
    if (resp.ok) {
      updateLocalCategories();
    }
    
  };

  async function updateLocalCategories() {
    const newCategories = allCategories.filter(
      (category) => category.id !== id
    );
    setAllCategories(newCategories);
  }

  return (
    <ModalBaseFull>
      {
        <div className="modal-card">
          <h3>Är du säker på att du vill ta bort den här kategorin?</h3>
          <div className="btn-area">
            <button
              type="button"
              className="btn-danger"
              onClick={() => handleClick(id)}
            >
              Ja
            </button>
            <button type="button" onClick={() => {setShowDeleteConfirm(false);setCategoryToDeleteId(null)}}>
              Nej
            </button>
          </div>
        </div>
      }
    </ModalBaseFull>
  );
};
export default DeleteConfirm;
