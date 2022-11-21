export default async function register(formData) {
	let data = await fetch("/api/register/", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(formData),
	})
	let response = await data.json()
	return response
}
