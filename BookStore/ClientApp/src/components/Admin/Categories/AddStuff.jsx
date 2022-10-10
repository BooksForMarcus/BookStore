import { useState } from "react";
import { useRecoilState } from "recoil";
import loggedInUserState from "../../../atoms/loggedInUserState";
import ModalBaseFull from "../../Modal/ModalBaseFull";

function AddStuff({ allCategories, setAllCategories }) {
  const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);
  const [name, setName] = useState("");
  const [createSuccess, setCreateSuccess] = useState(null);

  const handleClick = async (param) => {
    const resp = await fetch("/api/category/", {
      method: "POST",
      headers: {
        Authorization: loggedInUser.password,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ Name: param }),
    });
    if (resp.ok) {
      const json = await resp.json();
      const newCat = { id: json, name: name };
      const newCats = [...allCategories, newCat];
      newCats.sort((a, b) => a.name.localeCompare(b.name));
      setAllCategories(newCats);
      setCreateSuccess(true);
    } else {
      setCreateSuccess(false);
    }
  };

  return (
    <div>
      {createSuccess !== null && (
        <ModalBaseFull>
          <div className="modal-card">
            <h3>
              {createSuccess
                ? "Kategori skapad."
                : "Kategori kunde inte skapas."}
            </h3>
            <button
              className="jonas-button"
              onClick={() => setCreateSuccess(null)}
            >
              OK
            </button>
          </div>
        </ModalBaseFull>
      )}
      <div>
        {" "}
        <input
          className="jonas-input3"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <button className="jonas-button" onClick={() => handleClick(name)}>
          Lägg Till
        </button>
      </div>
    </div>
  );
}
export default AddStuff;
