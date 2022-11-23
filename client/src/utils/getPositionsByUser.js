export default async function getPositionsByUser(id) {
	// fen, folder_id, colour, user_id
	let data = await fetch(`/api/positions/${id}`, {
		method: "GET",
	})
	let response = await data.json()
	return response
}
