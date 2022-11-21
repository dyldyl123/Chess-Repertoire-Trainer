export default async function fetchLogin(formData) {
	let data = await fetch("/api/login/", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(formData),
	})
	let response = await data.json()
	return response
}
