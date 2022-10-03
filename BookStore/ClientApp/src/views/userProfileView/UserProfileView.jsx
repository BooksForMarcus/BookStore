import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../../App.css";
import "../userProfileView/userProfileStyle.css";
import { useRecoilState } from "recoil";
import loggedInUserState from "../../atoms/loggedInUserState";
import EditProfile from "../../components/Profile/EditProfile";
import UserSellerView from "../../components/Profile/UserSellerView";
import UserProfileOrderView from "../../components/Profile/UserProfileOrderView";

function UserProfileView() {
	
  const [user, setUser] = useRecoilState(loggedInUserState);
  const navigate = useNavigate();
  const [nav, setNav] = useState("details");

  useEffect(() => {
	if(localStorage.getItem("user")===null){
		navigate("/login");
	}
  },[user]);

  return (
    <div className="userprofile-view">
      <div className="side"></div>
      <div className="userprofile-wrap">
        {user !== null && (
          <div>
            <h1>
              {" "}
              Hej {user.firstName[0].toUpperCase() + user.firstName.slice(1)}
            </h1>
            <div className="profile-nav">
              <span
                className="profile-navlink"
                onClick={() => setNav("details")}
              >
                DINA UPPGIFTER
              </span>
              <span
                className="profile-navlink"
                onClick={() => setNav("orders")}
              >
                BESTÄLLNINGAR
              </span>
              {user && user.isSeller ? (
                <span
                  className="profile-navlink"
                  onClick={() => setNav("sellbooks")}
                >
                  SÄLJ BÖCKER
                </span>
              ) : (
                <span></span>
              )}
              {user && user.isAdmin ? (
                <NavLink className="profile-navlink" to="/admin">
                  ADMIN
                </NavLink>
              ) : (
                <span></span>
              )}
              <span
                className="profile-navlink"
                onClick={() => {localStorage.clear(); setUser(null);}}
              >
                LOGGA UT
              </span>
              {user && !user.isSeller ? (
                <div className="profile-email-contact-container" onClick={() => window.location = 'mailto:yourmail@gmail.com'}>
              <span className="profile-email-contact-link" >
                  Kontakta oss för att bli säljare
              </span>
              </div>
              ):
              (
                <span></span>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="add-account-wrap">
        {nav === "details" && <EditProfile />}
        {nav === "orders" && <UserProfileOrderView />}
        {nav === "sellbooks" && <UserSellerView />}
      </div>
    </div>
  );
}

export default UserProfileView;
