import { useState, useEffect, useContext } from "react"
import { Chess } from "chess.js"
import ChessBoardWidget from "./ChessBoardWidget"
import PositionTree from "./PositionTree"
import getMergedPositionsByUser from "../utils/getMergedPositionsByUser"
import getPositionsByUser from "../utils/getPositionsByUser"
import getOutstandingQueue from "../utils/getOutstandingQueue"
import { UserContext } from "../App"
export default function PositionBuilder({ mode }) {
	const [game, setGame] = useState(new Chess())
	const [test, setTest] = useState([
		{
			moveArray: [],
			currentMove: 0,
		},
	])
	const [treeData, setTreeData] = useState([])
	const [mergedData, setMergedData] = useState("")
	const { user, setUser } = useContext(UserContext)
	useEffect(() => {
		async function fetchdata() {
			let positions = await getPositionsByUser(user.id)
			setTreeData(positions)
		}

		async function fetchdata2() {
			let merged = await getMergedPositionsByUser(user.id)
			setMergedData(merged)
		}

		async function fetchdata3() {
			let cards = await getOutstandingQueue(user.id)
			setTreeData(cards)
		}
		if (mode === "learn") {
			fetchdata3()
		} else {
			fetchdata()
		}

		fetchdata2()
	}, [mode])
	return (
		<div className="position-builder">
			<ChessBoardWidget game={game} setGame={setGame} test={test} setTest={setTest}></ChessBoardWidget>
			<PositionTree game={game} setGame={setGame} mode={mode} test={test} setTest={setTest} treeData={treeData} setTreData={setTreeData}></PositionTree>
		</div>
	)
}
