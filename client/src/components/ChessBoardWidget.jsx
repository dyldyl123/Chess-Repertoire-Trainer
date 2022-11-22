import { useState } from "react"
import { Chess } from "chess.js"
import { Chessboard } from "react-chessboard"
import cloneDeep from "lodash/cloneDeep"
import SaveEditMode from "./SaveEditMode"
import { useContext } from "react"
import { UserContext } from "../App"
import saveCardScore from "../utils/saveCardScore"
export default function ChessBoardWidget({ game, setGame, test, setTest, mode }) {
	const { user, setuser } = useContext(UserContext)
	const [errors, setErrors] = useState(5)
	const [testScore, setTestScore] = useState(5)
	// get the current move of the test and change the board state to that
	// make sure it is the right colour of whose turn it is
	// check if the move is correct
	// if not check if the move is in the set of all positions, don't punish the user for picking the wrong line, let them try again
	// if it failes both checks, record the time taken and take away one life
	// if they run out of life or time is > some arbitrarly decided time
	// they score a 0
	// do a 'replay' of the correct move

	// record score somewhere and move onto next stage of test

	// if(mode === "learn" && test.length > 0)

	function setUpTestBoard(moveArray, maxMove) {
		const gameCopy = cloneDeep(game)

		for (let i = 0; i < maxMove; i++) {
			gameCopy.move(moveArray[i])
		}

		const result = gameCopy

		console.log(gameCopy)
		setGame(gameCopy)
	}
	function makeAMoveInTest(moveArray, currentMove, sourceSquare, targetSquare) {
		console.log("test move")
		let testGame = cloneDeep(game)
		testGame.move({
			from: sourceSquare,
			to: targetSquare,
		})
		let moveToCheck = testGame.undo()
		let moveToCheckSan = moveToCheck.san
		console.log(moveToCheckSan)
		console.log(moveArray)
		if (moveToCheckSan === moveArray[currentMove]) {
			console.log("correct")

			if (currentMove + 2 <= moveArray.length) {
				setTest({ ...test, currentMove: currentMove + 2 })
				// reset move time
				setUpTestBoard(moveArray, currentMove + 2)
			} else {
				// test is finish
				setTestScore(5 - errors)
				saveCardScore(test.id, 5 - errors, user.id)
				setErrors(0)
			}
		} else {
			// call function to check if this move is in the positions (probably by checking history)
			// setupTestBoard(moveArray,currentMOVE)
			setTest({ ...test, currentMove: currentMove })
			setErrors(errors - 1)
			if (errors === 0) {
				console.log(errors)
				setTestScore(0)
				saveCardScore(test.id, 0, user.id)
				setErrors(0)
				console.log("you dun goofed")
				// run replay
			}
			// if its not then give give them a score based on time
			// call setupTestBoard with MoveArray, maxmove+ 2
		}
	}

	function onDropInTest(sourceSquare, targetSquare) {
		let { moveArray, currentMove } = test
		setUpTestBoard(moveArray, currentMove)
		console.log(moveArray, currentMove)
		const move = makeAMoveInTest(moveArray, currentMove, sourceSquare, targetSquare)
	}
	function makeAMove(move) {
		const gameCopy = cloneDeep(game)
		const result = gameCopy.move(move)

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
		console.log("onDrop")
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
			<p>{JSON.stringify(user)}</p>
			<Chessboard position={game.fen()} onPieceDrop={onDropInTest} animationDuration={1300} />
			<SaveEditMode pgn={game.pgn()} colour={game.turn()}></SaveEditMode>
		</div>
	)
}
