import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../../App.css";
import { useRecoilState } from "recoil";
import loggedInUserState from "../../atoms/loggedInUserState";
import getBasicAuthString from "../../getBasicAuthString";
import ModalBaseFull from "../Modal/ModalBaseFull";

function EditProfile() {
  const [user, setUser] = useRecoilState(loggedInUserState);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState(
    !user || user.address === "string" ? "" : user.address
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);
  const navigate = useNavigate();

  const deleteUser = async () => {
    const userToDelete = JSON.stringify({ id: user.id });
    const requestOptions = {
      method: "DELETE",
      headers: {
        Authorization: user.password,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: userToDelete,
    };
    let resp = await fetch("/api/customer/", requestOptions);
    if (resp.ok) {
      setUser(null);
      navigate("/");
    }
  };

  const updateCustomer = async (e) => {
    e.preventDefault();

    const newUser = JSON.stringify({
      email: email,
      firstName: firstName,
      lastName: lastName,
      password: password,
      address: address,
    });
    console.log(newUser);
    const requestOptions = {
      method: "PUT",
      headers: {
        Authorization: user.password,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: newUser,
    };
    //let json = null;
    let resp = await fetch("/api/customer/updatecustomer", requestOptions);
    if (resp.ok) {
      let json = await resp.json();
      const oldUser = { ...user };
      if (user.firstName !== firstName && firstName !== "")
        oldUser.firstName = firstName;
      if (user.lastName !== lastName && lastName !== "")
        oldUser.lastName = lastName;
      //should user be able to change email?
      if (user.email !== email && email !== "") oldUser.email = email;
      if (user.address !== address && address !== "") oldUser.address = address;
      if (user.password !== password && password !== "") {
        const basicAuthString = getBasicAuthString(email, password);
        oldUser.password = basicAuthString;
      }
      setUser(oldUser);
      setShowUpdateConfirm(true);
    } else {
      let json = await resp.json();
    }
  };
  useEffect(() => {
    if (user === null) {
      navigate("/login"); //if user is not logged in, redirect to home page
    } else {
      setEmail(user.email);
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setAddress(user.address);
    }
  }, []);

  return (
      <div className="add-account-wrap">
        {showDeleteConfirm && (
          <ModalBaseFull>
            <div className="modal-card">
              <h2 className="modal-card-header">
                Är du säker på att du vill ta bort ditt konto?
              </h2>
              <div className="modal-card-footer">
                <button
                  type="button"
				          className="btn-danger"
                  onClick={deleteUser}
                >
                  Radera
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    setShowDeleteConfirm(false);
                  }}
                >
                  Avbryt
                </button>
              </div>
            </div>
          </ModalBaseFull>
        )}
        <h2 className="h2-light">Uppdatera din uppgifter</h2>
          <form onSubmit={updateCustomer}>
            <label htmlFor="email">
                <input
                  className="cr-account"
                  type="email"
                  placeholder="Email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                ></input>
                <span className="fl-label">Email</span>
            </label>
            <label htmlFor="firstname">
          <input
            className="cr-account"
            type="text"
            placeholder="Förnamn"
            id="firstname"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          ></input>
          <span className="fl-label">Förnamn</span>
          </label>
          <label htmlFor="lastname">
          <input
            className="cr-account"
            type="text"
            label="Efternamn"
            id="lastname"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          ></input>
          <span className="fl-label">Efternamn</span>
          </label>
          <label htmlFor="address">
          <input
            className="cr-account"
            type="text"
            placeholder="Adress"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          ></input>
          <span className="fl-label">Adress</span>
          </label>
          <label htmlFor="password">
          <input
            className="cr-account"
            type="password"
            placeholder="Nytt lösenord"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
          <span className="fl-label">Nytt lösenord</span>
          </label>
          <label htmlFor="confirm-password">
          <input
            className="cr-account"
            type="password"
            placeholder="Bekräfta nytt lösenord"
            id="confirm-password"
            value={confirmPassword}
            pattern={password}
            title="Måste vara samma som lösenordet."
            onChange={(e) => setConfirmPassword(e.target.value)}
            required={password !== ""}
          ></input>
          <span className="fl-label">Bekräfta nytt lösenord</span>
          </label>
          {showUpdateConfirm && 
          <span className="edit-user-response">Din profil är nu uppdaterad!</span>}
          <div className="edit-user-buttons">
          <button className="green-button" type="submit">
            Uppdatera
          </button>
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
          >
            Ta bort konto
          </button>
          </div>
        </form>
      </div>
  );
}

export default EditProfile;
