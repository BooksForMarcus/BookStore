import { translateStatus } from "../../script/orderStatus";

const UserOrderListView = ({order, setView}) => {
    let tempSeller = null;

    const setTempSeller = (b) => {
		console.log(b.soldById);
        b.soldById !== "store" ? tempSeller = order.sellers.find(s=> s.id === b.soldById) : null
    }
	const getSeller = (b) => {
		return order.sellers.find(s=> s.id === b.soldById)
	}
	const getSellerName = (b) => {
		var seller = getSeller(b);
		return seller.firstName + " " + seller.lastName;
	}
	const getSellerMail = (b) => {
		return getSeller(b).email;
	}

    
    return (
      <div className="user-order-profile-booklist">
                  <div className="user-order-details-container" key={"user"+order.id}>
                    <div className="user-order-details-container-1">
                        <span className="user-order-details-status">Status: {translateStatus(order.status)}</span>
                        <div className="user-order-details-wrap-date">
                            <span className="user-order-details-item">Datum:</span>
                            <span className="user-order-details-item">{order.date.slice(0,10)}</span>
                        </div>
                        <h2 className="user-order-details-item-OrderId">Order: #{order.id}</h2>
                    </div>
                    <div className="user-order-details-container-2">
                        <div className="user-order-details-wrap">
                            <span className="user-order-details-send">Skickas till:</span>
                            <span className="user-order-details-item">
                                {order.customer.firstName} {order.customer.lastName}
                            </span>
                            <span className="user-order-details-item">
                                {order.customer.address}
                            </span>
                        </div>
                        <div className="user-order-details-wrap">
                            <span className="user-order-details-item">
                                KundID: #{order.customer.id}
                            </span>
                            <span className="user-order-details-item">
                                E-mail: {order.customer.email}
                            </span>
                        </div>
                    </div>
                    <div className="user-order-details-container-3">
                    <div className="user-book-order-details-header-container">
                        <span className="user-order-book-item-h">Bokinformation</span>
                        <span className="user-order-book-item-h">à pris</span>
                        <span className="user-order-book-item-h">Antal</span>
                        <span className="user-order-book-item-h">Radsumma</span></div>
                        <span className="user-order-book-item-h"></span>
                        {order.books.map(b => <div className="user-book-order-details-container" key={"orderbook"+b.id}>
                            <div className="user-order-book-info">
                            <span className="user-order-book-info-title">{b.title}</span>
                            <span className="user-order-book-info-item">ID# {b.id}</span>
                            {setTempSeller(b)}
                            {b.soldById !== "store" ? 
                            (
                                <div className="user-order-book-seller-info">
                                    <span className="user-order-book-seller-info-item-h">SÄLJS AV :</span>
                                    <span className="user-order-book-seller-info-item">
                                        {getSellerName(b)}
                                    </span>
                                    <span className="user-order-book-seller-info-item">
                                        {getSellerMail(b)}
                                    </span>
                                </div>
                            ) : (
                            <div className="user-order-book-seller-info">
                                <span className="user-order-book-seller-info-item-h">SÄLJS AV :</span>
                                <span className="user-order-book-seller-info-item">
                                    Bokcirkeln
                                </span>
                            </div>
                            )
                            }
                            </div>
                            <span className="user-order-book-item">{b.price}:-</span>
                            <span className="user-order-book-item">{b.numInstock}</span>
                            <span className="user-order-book-item">{b.price*b.numInstock}:-</span>
                            
                            {!b.imageURL ? (
                                <div className="user-order-image-wrapper">
                                    <h4>Bild</h4>
                                </div>
                            ) : (
                                <div className="user-order-image-wrapper">
                                <img
                                className="user-order-img"
                                src={b.imageURL}
                                alt="Front image of book"
                                ></img>
                                </div>
                            )}
                            </div>)}
                    </div>
                    <div className="user-order-details-container-4">
                        <span className="user-order-details-sum-item">Total summa (exkl. frakt) =</span>
                        <span className="user-order-details-sum-item">{order.orderSum - order.postage} :-</span>
                        <span className="user-order-details-sum-item">Frakt (inkl. moms) =</span>
                        <span className="user-order-details-sum-item">{order.postage} :-</span>
                        <span className="user-order-details-sum-item">Moms =</span>
                        <span className="user-order-details-sum-item">{order.vat} :-</span>
                    </div>
                        <h2 className="user-order-details-item-sum">Total summa (inkl. frakt):</h2>
                        <h2 className="user-order-details-totalSum">{order.orderSum}:-</h2>
                        <button  className="user-order-details-close" onClick={() => setView("list")}>Stäng</button>
                  </div>
      </div>
    );
  };
  
  export default UserOrderListView;