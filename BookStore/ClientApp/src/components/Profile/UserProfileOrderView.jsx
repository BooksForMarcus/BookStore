import { useState, useEffect } from "react";
import "../../App.css";
import { useRecoilState } from "recoil";
import loggedInUserState from "../../atoms/loggedInUserState";
import { Link } from "react-router-dom";

function UserProfileOrderView() {
    const [user, setUser] = useRecoilState(loggedInUserState);

    //const getOrders = async () => {
    //    //Get list of order, not as Admin??
    //  };

    //const ListOrders = () => {
    //    return orders === null ? (
    //        <div className="seller-book-listitem-empty">
    //            <p>Laddar in beställningar</p>
    //        </div>
    //    ) : user !== null ? (
    //        getOrders().map((o, i) => {
    //            return (
    //                <div className="user-order-listitem" key={"customer" + o.id}>
    //                    <span className="user-order-listitem">
    //                        {b.price} sek
    //                    </span>
    //                    <span className="user-order-listitem">
    //                        {b.numInstock} st
    //                    </span>
    //                    {b.numInstock === 0 ?
    //                        (<span className="user-order-listitem">Såld</span>)
    //                        :
    //                        (<span className="user-order-listitem">Pågående</span>)}
    //                </div>
    //            );
    //        })
    //    ) : null;
    //};

    return (
        <div className="user-order-wrap">
            <h2 className="h2-light">Orderhistorik</h2>
            <div className="user-order-profile-booklist">
                <div className="user-order-profile-list-h">
                    <span className="user-order-profile-booklist-h-text">Order-ID</span>
                    <span className="user-order-profile-booklist-h-text">Datum</span>
                    <span className="user-order-profile-booklist-h-text">Summa</span>
                    <span className="user-order-profile-booklist-h-text-center">Status</span>
                </div>
                <div className="user-order-user-list">
                    <span className="user-order-profile-user-order-listitem">Order-ID</span>
                    <span className="user-order-profile-user-order-listitem">Datum</span>
                    <span className="user-order-profile-user-order-listitem">Summa</span>
                    <span className="user-order-profile-user-order-listitem-center">Status</span>
                </div>
                
                {/*<ListOrders />*/}
            </div>
        </div>
    );
}

export default UserProfileOrderView;
