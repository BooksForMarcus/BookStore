const UpdateOk = () => {
	const date = new Date()
	const timeNow = date.getHours() + ":" + String(date.getMinutes()).padStart(2,"0") + ":" + String(date.getSeconds()).padStart(2,"0")
	return (
		<div className="update-ok update-box">
			<h3>{timeNow} Uppdatering OK</h3>
		</div>
	  );
}

export default UpdateOk;