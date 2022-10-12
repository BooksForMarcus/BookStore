const UpdateFailed = () => {
	const date = new Date()
	const timeNow = date.getHours() + ":" + String(date.getMinutes()).padStart(2,"0") + ":" + String(date.getSeconds()).padStart(2,"0")
	return (
		<div className="update-fail update-box">
			<h3>{timeNow} Uppdatering misslyckades</h3>
		</div>
	  );
}

export default UpdateFailed;