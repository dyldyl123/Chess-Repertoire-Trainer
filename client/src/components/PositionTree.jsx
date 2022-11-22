import { useContext, useEffect, useState } from "react"
import TreeView, { flattenTree } from "react-accessible-treeview"
import { UserContext } from "../App"

import cloneDeep from "lodash/cloneDeep"

import { parse } from "@mliebelt/pgn-parser"

export default function PositionTree({ game, setGame, mode, setTest, treeData, setTreeData }) {
	const { user, setUser } = useContext(UserContext)

	const onClick = (data) => {
		const gameCopy = cloneDeep(game)
		const result = gameCopy.loadPgn(data)

		setGame(gameCopy)
	}

	const startTest = () => {
		if (mode === "learn" && treeData.length > 0) {
			let pgn = treeData[0].fen

			if (pgn) {
				let newGame = cloneDeep(game)
				newGame.loadPgn(pgn, { sloppy: true })
				let history = newGame.history()

				setTest({
					moveArray: history,
					currentMove: 2,
				})
				console.log(history)
				console.log(mode)
			}
		}
	}

	// let game2 = parse(mergedData)

	if (treeData.length > 0) {
		let renderedTreeData = treeData.map((x) => {
			if (mode === "learn") {
				return <p onClick={() => onClick(x.fen)}>{JSON.stringify(x)}</p>
			} else {
				return <p onClick={() => onClick(x.pgn)}>{JSON.stringify(x)}</p>
			}
		})
		return (
			<div className="position-tree">
				{renderedTreeData}
				<button onClick={() => startTest()}> Start Test</button>
			</div>
		)
	} else {
		return <p>Loading...</p>
	}
}
