import { useState, useEffect, createContext, useContext } from "react"
import ChessBoardWidget from "./components/ChessBoardWidget"
import "./App.css"
import verifyLogin from "./utils/verifyLogin"
import { BrowserRouter, Navigate, Routes, Route, Link } from "react-router-dom"
import Login from "./components/Login"
import Register from "./components/Register"
import PositionTree from "./components/PositionTree"
import PositionBuilder from "./components/PositionBuilder"
import TopNav from "./components/TopNav"
import getOutstandingQueue from "./utils/getOutstandingQueue"

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
	// useEffect(() => {
	// 	getOutstandingQueue()
	// }, [])

	return (
		<LoggedInContext.Provider value={isLoggedIn}>
			<BrowserRouter>
				<div className="App">
					{isLoggedIn && (
						<UserContext.Provider value={{ user, setUser }}>
							<TopNav />
						</UserContext.Provider>
					)}
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
										<PositionBuilder mode="create"></PositionBuilder>
									</RequireLoggedIn>
								</UserContext.Provider>
							}
						></Route>
						<Route
							path="/register"
							element={
								<UserContext.Provider value={{ user, setUser }}>
									<Register setIsLoggedIn={setIsLoggedIn} />
								</UserContext.Provider>
							}
						></Route>
						<Route
							path="/learn"
							element={
								<UserContext.Provider value={{ user, setUser }}>
									<RequireLoggedIn>
										<PositionBuilder mode="learn"></PositionBuilder>
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
