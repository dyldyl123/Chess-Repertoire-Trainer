export default async function saveCardScore(id, score, user_id) {
	const formattedData = {
		user_id: user_id,
		score: score,
		card_id: id,
	}
	let data = await fetch(`/api/setScore/${id}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(formattedData),
	})
	let response = await data.json()
	console.log(response)
}
