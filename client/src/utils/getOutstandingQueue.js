export default async function getOutstandingQueue(id) {
	// fen, folder_id, colour, user_id
	let data = await fetch(`/api/outstanding/${id}`, {
		method: "GET",
	})
	let response = await data.json()
	return response
}
