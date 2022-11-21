import { useState, useContext } from "react"
import register from "../utils/register"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../App"

export default function Register({ setIsLoggedIn }) {
	const navigate = useNavigate()
	const [formValue, setFormValue] = useState({})
	const { user, setUser } = useContext(UserContext)
	const [fields, setFields] = useState({
		username: "",
		password: "",
	})
	const onType = (event) => {
		const { name, value } = event.target
		setFields({ ...fields, [name]: value })
	}
	const onRegister = async (event) => {
		event.preventDefault()
		setFormValue(fields)
		const loggedInReponse = await register(fields)

		console.log("hi")
		console.log(loggedInReponse)
		if (loggedInReponse.user) {
			setIsLoggedIn(true)
			setUser(loggedInReponse.user)
			navigate("/")
		}
	}

	return (
		<div className="login-form">
			<form onSubmit={onRegister}>
				<label htmlFor="username">Username</label>
				<input type="text" name="username" onChange={onType} value={fields.username}></input>
				<input type="password" name="password" onChange={onType} value={fields.password}></input>
				<button type="submit">SUBMIT</button>
			</form>
		</div>
	)
}
