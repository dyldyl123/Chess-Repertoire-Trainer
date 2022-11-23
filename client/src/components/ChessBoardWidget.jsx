import { useState, useEffect } from "react"

import { Chessboard } from "react-chessboard"
import cloneDeep from "lodash/cloneDeep"
import SavePositionButton from "./SavePositionButton"
import { useContext } from "react"
import { UserContext } from "../App"
import saveCardScore from "../utils/saveCardScore"
import { useToast, Button } from "@chakra-ui/react"
export default function ChessBoardWidget({ game, setGame, test, setTest, mode, fetchRavPgn, fetchLearnQueue, queue }) {
	const toast = useToast()
	const { user, setuser } = useContext(UserContext)
	const [errors, setErrors] = useState(5)
	const [testScore, setTestScore] = useState(5)
	const [orientation, setOrientation] = useState("white")

	useEffect(() => {
		cloneAndReset()
	}, [mode])

	useEffect(() => {
		if (test.moveArray?.length === 0) {
			cloneAndReset()
		}
		let gameCopy = cloneDeep(game)
		gameCopy.reset()
		setGame(gameCopy)
		const wait = async () => {
			await setTimeout(5000)
		}
		wait()

		setUpTestBoard(test.moveArray, test.currentMove)
		setPlaySide(test.colour)
	}, [test])

	function cloneAndReset() {
		const gameCopy = cloneDeep(game)
		gameCopy.reset()

		setGame(gameCopy)
	}
	function setPlaySide(colour) {
		colour === "b" ? setOrientation("black") : setOrientation("white")
	}
	function setUpTestBoard(moveArray, maxMove) {
		const gameCopy = cloneDeep(game)

		for (let i = 0; i < maxMove; i++) {
			gameCopy.move(moveArray[i])
		}
		cloneAndReset()
		setGame(gameCopy)
	}
	async function makeAMoveInTest(moveArray, currentMove, sourceSquare, targetSquare) {
		if (errors === 0) {
			toast({
				title: "Failed variation test",
				description: "Unable to make a move, no errors left",
				status: "error",
				duration: 9000,
				isClosable: true,
			})

			return null
		}

		let testGame = cloneDeep(game)
		testGame.move({
			from: sourceSquare,
			to: targetSquare,
		})
		let moveToCheck = testGame.undo()
		let moveToCheckSan = moveToCheck.san
		console.log("test check", moveToCheckSan, moveArray[currentMove], currentMove)
		if (moveToCheckSan === moveArray[currentMove]) {
			toast({
				title: "Correct Move",
				status: "success",
				duration: 9000,
				isClosable: true,
			})

			if (currentMove + 2 <= moveArray.length) {
				setTest({ ...test, currentMove: currentMove + 2 })
				setUpTestBoard(moveArray, currentMove + 2)
			} else {
				toast({
					title: "Passed Varation Test",
					description: ":)",
					status: "success",
					duration: 9000,
					isClosable: true,
				})
				setTestScore(5 - errors)
				await saveCardScore(test.id, 5 - errors, user.id)
				fetchLearnQueue(user.id)
				setErrors(5)
				cloneAndReset()
			}
		} else {
			// call function to check if this move is in the positions (probably by checking history)
			setTest({ ...test, currentMove: currentMove })
			let newErrorCount = errors - 1
			setErrors(newErrorCount)
			toast({
				title: "Incorrect Move",
				duration: 9000,
				isClosable: true,
			})

			if (newErrorCount === 0) {
				toast({
					title: "Failed variation Test",
					description: `Calculating delay for next test attempt. The move list was as follows: ${test.moveArray}`,
					status: "error",
					duration: 9000,
					isClosable: true,
				})
				setTestScore(0)
				await saveCardScore(test.id, 0, user.id)
				fetchLearnQueue(user.id)
				setErrors(5)
				setTest({ moveArray: [], colour: "w", currentMove: 0 })
			}
		}
	}

	function onDropInTest(sourceSquare, targetSquare) {
		const { moveArray, currentMove } = test
		setUpTestBoard(moveArray, currentMove)
		makeAMoveInTest(moveArray, currentMove, sourceSquare, targetSquare)
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
		const move = makeAMove({
			from: sourceSquare,
			to: targetSquare,
		})

		if (move === null) return false
		return true
	}

	return (
		<div className="edit-mode">
			<p>Welcome {user && user.username}</p>
			<Chessboard position={game.fen()} onPieceDrop={mode === "learn" ? onDropInTest : onDrop} animationDuration={1300} boardOrientation={orientation} />
			<SavePositionButton
				pgn={game.pgn()}
				colour={game.turn()}
				history={game.history()}
				fetchRavPgn={fetchRavPgn}
				fetchLearnQueue={fetchLearnQueue}
				orientation={orientation}
			></SavePositionButton>
			<Button
				spacing="4"
				onClick={() => {
					setOrientation(orientation === "white" ? "black" : "white")
				}}
				colorScheme="yellow"
				size="sm"
			>
				Switch Orientation
			</Button>
			{mode !== "learn" && (
				<Button
					spacing="4"
					onClick={() => {
						const gameCopy = cloneDeep(game)
						gameCopy.undo()
						setGame(gameCopy)
					}}
					colorScheme="blackAlpha"
					size="sm"
				>
					Undo
				</Button>
			)}
		</div>
	)
}
