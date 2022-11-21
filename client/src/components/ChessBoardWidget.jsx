import { useState } from "react"
import { Chess } from "chess.js"
import { Chessboard } from "react-chessboard"
import cloneDeep from "lodash/cloneDeep"
import SaveEditMode from "./SaveEditMode"
export default function ChessBoardWidget() {
	const [game, setGame] = useState(new Chess())

	function makeAMove(move) {
		// const gameCopy = structuredClone(game)
		console.log(move)
		const gameCopy = cloneDeep(game)
		const result = gameCopy.move(move)
		// const result = gameCopy.move(move)
		console.log(gameCopy)
		console.log(result)
		console.log(gameCopy.pgn())
		console.log(gameCopy.getComments())

		setGame(gameCopy)
		return result // null if the move was illegal, the move object if the move was legal
	}

	function makeRandomMove() {
		const possibleMoves = game.moves()
		if (game.game_over() || game.in_draw() || possibleMoves.length === 0) return // exit if the game is over
		const randomIndex = Math.floor(Math.random() * possibleMoves.length)
		makeAMove(possibleMoves[randomIndex])
	}

	function onDrop(sourceSquare, targetSquare) {
		const move = makeAMove({
			from: sourceSquare,
			to: targetSquare,
		})

		// illegal move
		if (move === null) return false

		setTimeout(makeRandomMove, 200)
		return true
	}

	return (
		<div className="edit-mode">
			<Chessboard position={game.fen()} onPieceDrop={onDrop} />
			<SaveEditMode pgn={game.pgn()}></SaveEditMode>
		</div>
	)
}
