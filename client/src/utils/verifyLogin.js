export default async function verifyLogin() {
	let data = await fetch("http://localhost:9001/api/verify/")
	let response = await data.json()
	return response
}
