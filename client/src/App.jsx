import { useState, useEffect, createContext, useContext } from "react"
import ChessBoardWidget from "./components/ChessBoardWidget"
import "./App.css"
import verifyLogin from "./utils/verifyLogin"
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom"
import Login from "./components/Login"
export const LoggedInContext = createContext(false)
export const UserContext = createContext(false)
function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(() => {
		return //
	})

	const [user, setUser] = useState(false)

	const RequireLoggedIn = ({ children }) => {
		const isLoggedIn = useContext(LoggedInContext)
		if (isLoggedIn) {
			return children
		}
		return <Navigate to="/login" />
	}

	useEffect(() => {
		verifyLogin()
	}, [])

	const LoggedInUser = useContext(UserContext)
	console.log("wot")
	console.log(user)
	console.log(LoggedInUser)
	return (
		<LoggedInContext.Provider value={isLoggedIn}>
			<UserContext.Provider value={user}>
				<BrowserRouter>
					<div className="App">
						<Routes>
							<Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} />}></Route>
							<Route
								path="/"
								element={
									<RequireLoggedIn>
										<p>{JSON.stringify(LoggedInUser)}</p>
										<ChessBoardWidget></ChessBoardWidget>
									</RequireLoggedIn>
								}
							></Route>
						</Routes>
					</div>
				</BrowserRouter>
			</UserContext.Provider>
		</LoggedInContext.Provider>
	)
}

export default App
