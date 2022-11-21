import { useState, useEffect, createContext, useContext } from "react"
import ChessBoardWidget from "./components/ChessBoardWidget"
import "./App.css"
import verifyLogin from "./utils/verifyLogin"
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom"
import Login from "./components/Login"
export const LoggedInContext = createContext(false)
export const UserContext = createContext({})
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

	return (
		<LoggedInContext.Provider value={isLoggedIn}>
			<BrowserRouter>
				<div className="App">
					<Routes>
						<Route
							path="/login"
							element={
								<UserContext.Provider value={{ user, setUser }}>
									<Login setIsLoggedIn={setIsLoggedIn} />
								</UserContext.Provider>
							}
						></Route>
						<Route
							path="/"
							element={
								<UserContext.Provider value={{ user, setUser }}>
									<RequireLoggedIn>
										<ChessBoardWidget></ChessBoardWidget>
									</RequireLoggedIn>
								</UserContext.Provider>
							}
						></Route>
					</Routes>
				</div>
			</BrowserRouter>
		</LoggedInContext.Provider>
	)
}

export default App
