import { useContext, useEffect, useState } from "react"
// import TreeView, { flattenTree } from "react-accessible-treeview"
import { json } from "react-router-dom"
import { UserContext } from "../App"
import getPositionsByUser from "../utils/getPositionsByUser"
import cloneDeep from "lodash/cloneDeep"
import getMergedPositionsByUser from "../utils/getMergedPositionsByUser"
import { parse } from "@mliebelt/pgn-parser"
export default function PositionTree({ game, setGame }) {
	const [treeData, setTreeData] = useState([])
	const [mergedData, setMergedData] = useState("")
	const { user, setUser } = useContext(UserContext)
	useEffect(() => {
		async function fetchdata() {
			let positions = await getPositionsByUser(user.id)
			setTreeData(positions)
		}
		fetchdata()
		async function fetchdata2() {
			let merged = await getMergedPositionsByUser(user.id)
			setMergedData(merged)
		}
		fetchdata2()
	}, [])

	const onClick = (data) => {
		const gameCopy = cloneDeep(game)
		// const result = gameCopy.loadPgn(data)

		const result = gameCopy.loadPgn(mergedData)
		setGame(gameCopy)
	}
	let game2 = parse(mergedData)
	console.log(game2)

	if (treeData.length > 0) {
		let renderedTreeData = treeData.map((x) => <p onClick={() => onClick(x.pgn)}>{JSON.stringify(x)}</p>)
		return <p>{renderedTreeData}</p>
	} else {
		return <p>Loading...</p>
	}
}
