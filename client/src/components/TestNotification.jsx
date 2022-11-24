import { useEffect, useState, useContext } from "react"
import { UserContext } from "../App"
import getOutstandingQueue from "../utils/getOutstandingQueue"
import { queueAtom } from "./PositionBuilder"
import { useAtom } from "jotai"
export default function TestNotification() {
	const [queue] = useAtom(queueAtom)
	const [notifications, setNotifications] = useState(0)
	const { user, setUser } = useContext(UserContext)
	console.log(queue)

	useEffect(() => {
		setNotifications(queue.length)
	}, [queue])

	return <h1 className="notification">Outstanding Tests {notifications}</h1>
}
