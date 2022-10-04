const UserOrderListView = ({order, setView}) => {
    return (
      <div className="user-order-profile-booklist">
                  <div className="user-order-details-container" key={"user"+order.id}>
                    <div className="user-order-details-container-1">
                        <span className="user-order-details-status">Status: {order.status}</span>
                        <div className="user-order-details-date">
                            <span className="user-order-details-item">Datum:</span>
                            <span className="user-order-details-item">{order.date.slice(0,10)}</span>
                        </div>
                        <h2 className="user-order-details-item-OrderId">Order: #{order.id}</h2>
                    </div>
                    <div className="user-order-details-container-2">
                        <div className="user-order-details-date">
                            <span className="user-order-details-item">Skickas till:</span>
                            <span className="user-order-details-item">
                                {order.customer.firstName} {order.customer.lastName}
                            </span>
                            <span className="user-order-details-item">
                                {order.customer.address}
                            </span>
                        </div>
                        <div className="user-order-details-date">
                            <span className="user-order-details-item">
                                KundID: #{order.customer.id}
                            </span>
                            <span className="user-order-details-item">
                                E-mail: {order.customer.email}
                            </span>
                        </div>
                    </div>
                    <div className="user-order-details-container-3">
                        {order.books.map(b => <div className="user-book-order-details-container">
                            <span className="user-order-book-item">{b.title}</span>
                            <span className="user-order-book-item">{b.price}:-</span>
                            <span className="user-order-book-item">Antal</span>
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
                    <span className="user-order-details-item">Total summa (exkl. frakt): {order.orderSum}:-</span>
                    <span className="user-order-details-item">Moms: {order.vat}:-</span>
                    <span className="user-order-details-item">Frakt: {order.postage}:-</span>
                    </div>
                    <h2 className="user-order-details-item-sum">Total summa (inkl. frakt):</h2>
                    <h2 className="user-order-details-totalSum">{order.orderSum + order.postage}:-</h2>
                    <button  className="user-order-details-close" onClick={() => setView("list")}>Stäng</button>
                  </div>
      </div>
    );
  };
  
  export default UserOrderListView;