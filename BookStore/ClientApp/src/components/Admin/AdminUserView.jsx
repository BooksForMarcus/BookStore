import { useState } from "react";
import { useRecoilState } from "recoil";
import loggedInUserState from "../../atoms/loggedInUserState";
import AdminUserEdit from "./AdminUserEdit";
import AdminUserList from "./AdminUserList";
import AdminUserSearchBar from "./AdminUserSearchBar";

const AdminUserView = ({ users, setUsers }) => {
  const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);
  const [userIdToEdit, setUserIdToEdit] = useState(null);
  const [usersToShow, setUsersToShow] = useState(null);

  const getAllUsers = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: loggedInUser.password,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    let resp = await fetch("/api/customer/admin/getusers", requestOptions);
    if (resp.ok) {
      let json = await resp.json();
      setUsers(json);
    } else {
      //maybe do something here?
    }
  };

  return userIdToEdit === null ? (
    <div className="admin-user-list-container">
      {users === null && (
        <button onClick={getAllUsers} disabled={loggedInUser === null}>
          Hämta alla kunder.
        </button>
      )}
      {users !== null && (
        <AdminUserSearchBar users={users} setUsersToShow={setUsersToShow} />
      )}
      {users !== null && (
        <AdminUserList
          users={usersToShow === null ? users : usersToShow}
          setUserIdToEdit={setUserIdToEdit}
        />
      )}
    </div>
  ) : (
    <AdminUserEdit
      userToEdit={users.find((u) => u.id === userIdToEdit)}
      setUserToEdit={setUserIdToEdit}
      loggedInUser={loggedInUser}
	  setLoggedInUser={setLoggedInUser}
      users={users}
      setUsers={setUsers}
    />
  );
};

export default AdminUserView;
