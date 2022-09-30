import { useState, useEffect } from "react";
import "../../App.css";
import { useRecoilState } from "recoil";
import loggedInUserState from "../../atoms/loggedInUserState";
import getBasicAuthString from "../../getBasicAuthString";
import ModalBaseFull from "../Modal/ModalBaseFull";
import BookCrud from "../AddBook/BookCrud";

function UserSellerView() {


  return (
      <div className="profileNav-wrap">
        <h2 className="ud-head-text">Sälj böcker</h2>
        <BookCrud isEdit={false}/>
      </div>
  );
}

export default UserSellerView;
