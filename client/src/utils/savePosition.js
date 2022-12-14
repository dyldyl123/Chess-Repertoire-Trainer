export default async function savePosition(id, positionData) {
	// fen, folder_id, colour, user_id
	let data = await fetch(`/api/position/${id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(positionData),
	})
	let response = await data.json()
	console.log(response)
}
