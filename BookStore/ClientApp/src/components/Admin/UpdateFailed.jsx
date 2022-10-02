const UpdateFailed = () => {
	const date = new Date()
	const timeNow = date.getHours() + ":" + String.format("%02d",date.getMinutes()) + ":" + String.format("%02d",date.getSeconds())
	return (
		<div className="update-fail update-box">
			<h3>{timeNow} Uppdatering misslyckades</h3>
		</div>
	  );
}

export default UpdateFailed;