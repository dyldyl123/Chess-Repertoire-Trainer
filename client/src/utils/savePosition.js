export default async function savePosition(id, positionData) {
	// fen, folder_id, colour, user_id
	let data = await fetch(`http://localhost:9001/api/savePosition/${id}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(positionData),
	})
	let response = await data.json()
	console.log(response)
}
