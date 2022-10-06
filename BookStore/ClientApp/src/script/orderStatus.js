const translateStatus = (status) => {
      switch (status) {
        case orderStatus.PENDING:
          return orderStatus.PENDING_SV;
        case orderStatus.PROCESSING:
          return orderStatus.PROCESSING_SV;
        case orderStatus.SHIPPED:
          return orderStatus.SHIPPED_SV;
        case orderStatus.CANCELED:
          return orderStatus.CANCELED_SV;
        case orderStatus.RETURNED:
          return orderStatus.RETURNED_SV;
        default:
          return "Okänd status";
      
    }
  };
  const orderStatus = {
	PENDING: "Pending",
	PROCESSING: "Processing",
	SHIPPED: "Shipped",
	CANCELED: "Canceled",
	RETURNED: "Returned",
	PENDING_SV: "Smörgås",
	PROCESSING_SV: "Bearbetas",
	SHIPPED_SV: "Skickad",
	CANCELED_SV: "Avbeställd",
	RETURNED_SV: "Returnerad"
 }

 export { translateStatus, orderStatus };