import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import UpdateOk from "../UpdateOk";
import UpdateFailed from "../UpdateFailed";
import getBasicAuthString from "../../../getBasicAuthString";
import ModalBaseFull from "../../Modal/ModalBaseFull";

const AdminUserEdit = ({
  userToEdit,
  setUserToEdit,
  loggedInUser,
  setLoggedInUser,
  users,
  setUsers,
}) => {
  const [email, setEmail] = useState(userToEdit.email);
  const [firstName, setFirstName] = useState(userToEdit.firstName);
  const [lastName, setLastName] = useState(userToEdit.lastName);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState(userToEdit.address);
  const [isAdmin, setIsAdmin] = useState(userToEdit.isAdmin);
  const [isSeller, setIsSeller] = useState(userToEdit.isSeller);
  const [isBlocked, setIsBlocked] = useState(userToEdit.isBlocked);
  const [isActive, setIsActive] = useState(userToEdit.isActive);
  const [updateOk, setUpdateOk] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteResult, setDeleteResult] = useState(null);
  const [showDeleteResult, setShowDeleteResult] = useState(false);

  const sendUpdatedUserToApi = async (e) => {
    e.preventDefault();
    const updatedUser = {
      id: userToEdit.id,
      email: email,
      firstName: firstName,
      lastName: lastName,
      password: password,
      address: address,
      isAdmin: isAdmin,
      isSeller: isSeller,
      isBlocked: isBlocked,
      isActive: isActive,
    };
    const requestOptions = {
      method: "PUT",
      headers: {
        Authorization: loggedInUser.password,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUser),
    };

    let resp = await fetch("/api/customer/updatecustomer", requestOptions);
    if (resp.ok) {
      if (password !== "" && userToEdit.id === loggedInUser.id) {
        const basicAuthString = getBasicAuthString(email, password);
        setLoggedInUser({ ...loggedInUser, password: basicAuthString });
      }
      let json = await resp.json();
      setUpdateOk(true);
      var newUsers = users.filter((x) => x.id !== userToEdit.id);
      newUsers.push(updatedUser);
      newUsers.sort((a, b) => {
        const emailA = a.email.toUpperCase();
        const emailB = b.email.toUpperCase();
        if (emailA < emailB) {
          return -1;
        }
        if (emailA > emailB) {
          return 1;
        }
        return 0;
      });
      setUsers(newUsers);
    } else {
      setUpdateOk(false);
    }
  };

  const deleteUser = async () => {
    const userToDelete = JSON.stringify({ id: userToEdit.id });
    const requestOptions = {
      method: "DELETE",
      headers: {
        Authorization: loggedInUser.password,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: userToDelete,
    };
    let resp = await fetch("/api/customer/", requestOptions);
    if (resp.ok) {
      setDeleteResult(true);
    } else {
      setDeleteResult(false);
    }
    setShowDeleteConfirm(false);
    setShowDeleteResult(true);
  };
  const deleteResultAcknowledge = () => {
    if (deleteResult) {
      let newUsers = users.filter((x) => x.id !== userToEdit.id);
      setUsers(newUsers);
      setUserToEdit(null);
    }
    setDeleteResult(null);
    setShowDeleteResult(false);
  };

  return (
    <div className="admin-user-edit">
      {showDeleteConfirm && (
        <ModalBaseFull>
          <div className="modal-card">
            <h2 className="modal-card-header">
              ??r du s??ker p?? att du vill ta bort den h??r kunden?
            </h2>
            <div className="modal-card-footer">
              <button type="button" onClick={deleteUser} className="btn-danger">
                Radera
              </button>
              <button type="button" onClick={deleteResultAcknowledge}>
                Avbryt
              </button>
            </div>
          </div>
        </ModalBaseFull>
      )}
      {showDeleteResult && (
        <ModalBaseFull>
          <div className="modal-card">
            <h3 className="modal-card-header">
              {deleteResult
                ? "Kunden borttagen."
                : "Kunde inte ta bort kunden."}
            </h3>
            <div className="btn-area">
              <button
                type="button"
                onClick={() => {
                  setDeleteResult(null);
                  setShowDeleteResult(false);
                  if (deleteResult) setUserToEdit(null);
                }}
              >
                Ok
              </button>
            </div>
          </div>
        </ModalBaseFull>
      )}
      <button className="btn-x-mark" onClick={() => setUserToEdit(null)}>
        <FontAwesomeIcon icon={faXmark} />
      </button>
      <form onSubmit={sendUpdatedUserToApi}>
        <h2>??ndra anv??ndare</h2>
        <label htmlFor="email">Email</label>
        <input
          type="text"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="firstName">F??rnamn:</label>
        <input
          type="text"
          id="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <label htmlFor="lastName">Efternamn:</label>
        <input
          type="text"
          id="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <label htmlFor="address">Adress:</label>
        <input
          type="text"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <label htmlFor="password">Nytt l??senord:</label>
        <input
          type="password"
          id="password"
          value={password}
          placeholder="L??mna tomt om du inte vill ??ndra l??senordet."
          onChange={(e) => setPassword(e.target.value)}
        />
        <label htmlFor="confirm-password">Bekr??fta l??senord:</label>
        <input
          type="password"
          id="confirm-password"
          value={confirmPassword}
          placeholder="L??mna tomt om du inte vill ??ndra l??senordet."
          pattern={password}
          required={password !== ""}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            e.target.setCustomValidity(
              e.target.validity.patternMismatch
                ? "L??senorden matchar inte."
                : ""
            );
          }}
        />
        <div className="admin-user-edit-checkbox-area">
          <div>
            <label htmlFor="isSeller">S??ljare</label>
            <input
              type="checkbox"
              id="isSeller"
              checked={isSeller}
              onChange={(e) => setIsSeller(e.target.checked)}
            />
          </div>
          <div>
            <label htmlFor="isBlocked">Blockerad</label>
            <input
              type="checkbox"
              id="isBlocked"
              checked={isBlocked}
              onChange={(e) => setIsBlocked(e.target.checked)}
            />
          </div>
          <div>
            <label htmlFor="isActive">Konto aktivt</label>
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
          </div>
          <div>
            <label htmlFor="isAdmin">Administrat??r</label>
            <input
              type="checkbox"
              id="isAdmin"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
              disabled={userToEdit.id === loggedInUser.id}
            />
          </div>
        </div>
        <div className="admin-user-edit-button-area">
          <button type="button" onClick={() => setUserToEdit(null)}>
            St??ng
          </button>
          <button type="submit">Spara</button>
          <button
            type="button"
            className="btn-danger"
            onClick={(e) => {
              e.preventDefault;
              setShowDeleteConfirm(true);
            }}
          >
            Radera
          </button>
        </div>
      </form>
      {updateOk === true && <UpdateOk />}
      {updateOk === false && <UpdateFailed />}
    </div>
  );
};

export default AdminUserEdit;
