import { useState } from "react"
import { Chess } from "chess.js"
import ChessBoardWidget from "./ChessBoardWidget"
import PositionTree from "./PositionTree"

export default function PositionBuilder() {
	const [game, setGame] = useState(new Chess())
	return (
		<div className="position-builder">
			<ChessBoardWidget game={game} setGame={setGame}></ChessBoardWidget>
			<PositionTree game={game} setGame={setGame}></PositionTree>
		</div>
	)
}
