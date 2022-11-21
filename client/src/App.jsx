import { useState, useEffect, createContext, useContext } from "react"
import ChessBoardWidget from "./components/ChessBoardWidget"
import "./App.css"
import verifyLogin from "./utils/verifyLogin"
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom"
import Login from "./components/Login"
const LoggedInContext = createContext(false)

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(() => {
		return //
	})
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
						<Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />}></Route>
						<Route
							path="/"
							element={
								<RequireLoggedIn>
									<ChessBoardWidget></ChessBoardWidget>
								</RequireLoggedIn>
							}
						></Route>
					</Routes>
				</div>
			</BrowserRouter>
		</LoggedInContext.Provider>
	)
}

export default App
