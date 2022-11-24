import { useContext, useEffect, useState } from "react"
import { UserContext } from "../App"
import cloneDeep from "lodash/cloneDeep"
import { Button } from "@chakra-ui/react"
export default function PositionTree({ game, setGame, mode, setTest, queue, setQueue }) {
	const { user, setUser } = useContext(UserContext)

	const startTest = () => {
		console.log(game.history())
		if (mode === "learn" && queue.length > 0) {
			let pgn = queue[0].fen

			if (pgn) {
				let newGame = cloneDeep(game)
				newGame.loadPgn(pgn, { sloppy: true })
				let history = newGame.history()

				newGame.reset()
				setGame(newGame)

				setTest({
					moveArray: history,
					currentMove: queue[0].colour === "w" ? 2 : 1,
					id: queue[0].id,
					colour: queue[0].colour === "w" ? "w" : "b",
				})
			}
		}
	}

	if (queue.length > 0) {
		return <div className="position-tree">{mode === "learn" && <Button onClick={() => startTest()}> Start Test</Button>}</div>
	} else {
		if (mode === "learn") {
			return <p>No Active Tests, Please come back later</p>
		}
		return null
	}
}
