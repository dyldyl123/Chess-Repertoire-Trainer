export default async function verifyLogin() {
	let data = await fetch("/api/verify/")
	let response = await data.json()
	return response
}
