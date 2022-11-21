export default async function createPosition(positionData) {
	// fen, folder_id, colour, user_id
	let data = await fetch(`/api/position/`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(positionData),
	})
	let response = await data.json()
	console.log(response)
}
