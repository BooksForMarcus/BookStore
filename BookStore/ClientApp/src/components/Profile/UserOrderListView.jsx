

const UserOrderListView = ({orders,setView}) => {
  return (
    <div className="user-order-profile-booklist">
            <h2 className="h2-light">Orderhistorik</h2>
                <div className="user-order-profile-list-h">
                    <span className="user-order-profile-booklist-h-text">Order-ID</span>
                    <span className="user-order-profile-booklist-h-text">Datum</span>
                    <span className="user-order-profile-booklist-h-text">Summa</span>
                    <span className="user-order-profile-booklist-h-text-center">Status</span>
                </div>
                {orders !== null 
                ? orders.map(o => <div 
                className="user-order-user-list" 
                key={"user"+o.id}
                onClick={()=>setView("details-"+o.id)}>
                    <span className="user-order-profile-user-order-listitem">{o.id}</span>
                    <span className="user-order-profile-user-order-listitem">{o.date.slice(0,10)}</span>
                    <span className="user-order-profile-user-order-listitem">{o.orderSum} sek</span>
                    <span className="user-order-profile-user-order-listitem-center">{o.status}</span>
                </div>)
                : null}
                
    </div>
  );
};

export default UserOrderListView;