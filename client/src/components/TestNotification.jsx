import { useEffect, useState, useContext } from "react"
import { UserContext } from "../App"
import getOutstandingQueue from "../utils/getOutstandingQueue"
export default function TestNotification() {
	const [notifications, setNotifications] = useState(0)
	const { user, setUser } = useContext(UserContext)
	useEffect(() => {
		const fetchOutstandingCards = async () => {
			const queue = await getOutstandingQueue(user.id)

			setNotifications(queue.length)
		}
		fetchOutstandingCards()
	})

	return <h1 className="notification">{notifications}</h1>
}
