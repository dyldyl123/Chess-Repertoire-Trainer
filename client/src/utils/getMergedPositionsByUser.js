export default async function getMergedPositionsByUser(id) {
	// fen, folder_id, colour, user_id
	let data = await fetch(`/api/mergepositions/${id}`, {
		method: "GET",
	})
	let response = await data.json()
	console.log(response)
	return response
}
