const UpdateOk = () => {
	const date = new Date()
	const timeNow = date.getHours() + ":" + String(date.getMinutes()).padStart(2,"0") + ":" + String(date.getSeconds()).padStart(2,"0")
	return (
		<div className="Order-created">
			<h3>{timeNow} Din beställning är gjord</h3>
		</div>
	  );
}

export default UpdateOk;