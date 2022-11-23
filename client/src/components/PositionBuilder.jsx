import { useState, useEffect, useContext } from "react"
import { Chess } from "chess.js"
import ChessBoardWidget from "./ChessBoardWidget"
import PositionTree from "./PositionTree"
import getRavPgn from "../utils/getRavPgn"
import getOutstandingQueue from "../utils/getOutstandingQueue"
import { UserContext } from "../App"
import UITree from "./uiTree"
import { parse } from "@mliebelt/pgn-parser"
export default function PositionBuilder({ mode }) {
	const [game, setGame] = useState(new Chess())
	const [test, setTest] = useState([
		{
			moveArray: [],
			currentMove: 0,
			colour: "white",
		},
	])
	const [queue, setQueue] = useState([])
	const [parsedRavPgn, setParsedRavPgn] = useState([])
	const { user, setUser } = useContext(UserContext)

	async function fetchRavPgn(id) {
		const ravPgn = await getRavPgn(id)
		const parsed_data = parse(ravPgn)
		setParsedRavPgn(parsed_data)
	}

	async function fetchLearnQueue(id) {
		const cards = await getOutstandingQueue(id)
		setQueue(cards)
	}
	useEffect(() => {
		if (mode === "learn") {
			fetchLearnQueue(user.id)
		}
		fetchRavPgn(user.id)
	}, [mode])

	return (
		<div className="position-builder">
			<ChessBoardWidget
				game={game}
				setGame={setGame}
				test={test}
				setTest={setTest}
				mode={mode}
				fetchLearnQueue={fetchLearnQueue}
				fetchRavPgn={fetchRavPgn}
				queue={queue}
			></ChessBoardWidget>
			<PositionTree game={game} setGame={setGame} mode={mode} test={test} setTest={setTest} queue={queue} setQueue={setQueue}></PositionTree>
			<UITree parsedRavPgn={parsedRavPgn}></UITree>
		</div>
	)
}
