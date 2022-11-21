import { useState } from "react"
import fetchLogin from "../utils/Login"
import { useNavigate } from "react-router-dom"
export default function Login({ setIsLoggedIn }) {
	const navigate = useNavigate()
	const [formValue, setFormValue] = useState({})
	const [fields, setFields] = useState({
		username: "",
		password: "",
	})
	const onType = (event) => {
		const { name, value } = event.target
		setFields({ ...fields, [name]: value })
	}
	const onSignIn = async (event) => {
		event.preventDefault()
		setFormValue(fields)
		const loggedInReponse = await fetchLogin(fields)
		if (loggedInReponse.user) {
			setIsLoggedIn(true)
			navigate("/")
		}
	}
	return (
		<div className="login-form">
			<form onSubmit={onSignIn}>
				<label htmlFor="username">Username</label>
				<input type="text" name="username" onChange={onType} value={fields.username}></input>
				<input type="password" name="password" onChange={onType} value={fields.password}></input>
				<button type="submit">SUBMIT</button>
			</form>
		</div>
	)
}
