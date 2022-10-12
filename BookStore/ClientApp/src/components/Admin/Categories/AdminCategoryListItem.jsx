import { useState } from "react";
import { useRecoilState } from "recoil";
import loggedInUserState from "../../../atoms/loggedInUserState";

function AdminCategoryListItem({
  category,
  allCategories,
  setAllCategories,
  setShowDeleteConfirm,
  setCategoryToDeleteId,
}) {
  const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);
  const [name, setName] = useState(category.name);

  const editClick = (event, param, param2) => {
    fetch("/api/category/", {
      method: "PUT",
      headers: {
        Authorization: loggedInUser.password,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ Id: param, Name: param2 }),
    }).then(updateCats());
  };

  async function updateCats() {
    const newCat = { ...category, name: name };
    const newCats = allCategories.map((c) =>
      c.id === category.id ? newCat : c
    );
    setAllCategories(newCats);
  }

  return (
    <div className="jonas-tr">
      <div>{category.name} </div>
      <div>
        {" "}
        <button
          className="jonas-button"
          onClick={() => {
            setShowDeleteConfirm(true);
            setCategoryToDeleteId(category.id);
          }}
        >
          Ta Bort
        </button>
      </div>
      <div>Nytt namn:</div>
      <div>
        {" "}
        <input
          className="jonas-input2"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        {" "}
        <button
          className="jonas-button"
          disabled={name.trim() === category.name}
          onClick={(event) => editClick(event, category.id, name)}
        >
          Ändra
        </button>
      </div>
    </div>
  );
}
export default AdminCategoryListItem;
