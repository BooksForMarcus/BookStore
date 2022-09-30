const UpdateOk = () => {
	const date = new Date()
	const timeNow = date.getHours() + ":" + String.format("%02d",date.getMinutes()) + ":" + String.format("%02d",date.getSeconds())
	return (
		<div className="update-ok update-box">
			<h3>{timeNow} Uppdatering OK</h3>
		</div>
	  );
}

export default UpdateOk;