import { useState, useEffect } from "react";
import "../../App.css";
import { useRecoilState } from "recoil";
import loggedInUserState from "../../atoms/loggedInUserState";
import getBasicAuthString from "../../getBasicAuthString";
import ModalBaseFull from "../Modal/ModalBaseFull";
import AddBookView from "../AddBook/AddBookView";

function UserSellerView() {


  return (
      <div className="profileNav-wrap">
        <h2 className="ud-head-text">Sälj böcker</h2>
        <AddBookView />
      </div>
  );
}

export default UserSellerView;
