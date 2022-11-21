export default async function Register(formData) {
	let data = await fetch("http://localhost:9001/api/register/", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(formData),
	})
	let response = await data.json()
	console.log(response)
}
