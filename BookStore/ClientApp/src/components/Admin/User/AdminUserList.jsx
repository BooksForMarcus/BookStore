import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faScrewdriverWrench,
  faLock,
  faLightbulb,
  faCommentDollar,
} from "@fortawesome/free-solid-svg-icons";

const AdminUserList = ({ users,setUserIdToEdit }) => {
  return (
    <div className="admin-user-list">
      <div className="user-list-item">
        <div className="user-list-item-info">
          <h3>Kundnummer</h3>
		  <h3>Email</h3>
		  <h3>Förnamn</h3>
		  <h3>Efternamn</h3>
        </div>
      </div>
      {users.map((user) => {
        return (
          <div className="user-list-item" key={user.id}>
            <div className="user-list-item-info">
              <p>{user.id}</p>
              <p>{user.email}</p>
              <p>{user.firstName}</p>
              <p>{user.lastName}</p>
            </div>
            <div className="user-list-item-util">
              {user.isAdmin && <FontAwesomeIcon icon={faScrewdriverWrench} />}
              {user.isBlocked && <FontAwesomeIcon icon={faLock} />}
              {user.isActive && <FontAwesomeIcon icon={faLightbulb} />}
              {user.isSeller && <FontAwesomeIcon icon={faCommentDollar} />}
              <button onClick={() => setUserIdToEdit(user.id)}>Ändra</button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminUserList;
