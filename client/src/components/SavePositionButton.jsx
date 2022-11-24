import createPosition from "../utils/createPosition"
import { useToast, Button } from "@chakra-ui/react"
import { useContext } from "react"
import { UserContext } from "../App"

export default function SavePositionButton({ pgn, fetchLearnQueue, fetchRavPgn, history, orientation }) {
	const { user, setUser } = useContext(UserContext)
	const toast = useToast()
	const formattedData = {
		pgn: pgn,
		colour: orientation[0],
	}
	const clickSave = async () => {
		await createPosition(formattedData)
		fetchLearnQueue(user.id)
		fetchRavPgn(user.id)
	}

	return (
		<Button
			onClick={() => {
				if (history.length > 6) {
					clickSave()
					toast({
						title: "Successfully saved variation",
						status: "success",
						duration: 9000,
						isClosable: true,
					})
				} else {
					toast({
						title: "Save Error",
						description: "Unable to save position, it must be atleast 6 plys in length",
						status: "error",
						duration: 9000,
						isClosable: true,
					})
				}
			}}
			size="sm"
		>
			Save
		</Button>
	)
}
