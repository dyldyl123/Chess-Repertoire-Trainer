import { useContext, useEffect, useState } from "react"
// import TreeView, { flattenTree } from "react-accessible-treeview"
import { json } from "react-router-dom"
import { UserContext } from "../App"
import getPositionsByUser from "../utils/getPositionsByUser"

export default function PositionTree() {
	const [treeData, setTreeData] = useState([])
	const { user, setUser } = useContext(UserContext)
	useEffect(() => {
		async function fetchdata() {
			let positions = await getPositionsByUser(user.id)
			setTreeData(positions)
		}
		fetchdata()
	}, [])
	if (treeData.length > 0) {
		let renderedTreeData = treeData.map((x) => <p>{JSON.stringify(x)}</p>)
		return <p>{renderedTreeData}</p>
	} else {
		return <p>Loading...</p>
	}
}
