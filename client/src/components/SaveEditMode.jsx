import savePosition from "../utils/savePosition"
import createPosition from "../utils/createPosition"
export default function SaveEditMode({ pgn, colour }) {
	const formattedData = {
		pgn: pgn,
		colour: colour,
	}
	return <button onClick={() => createPosition(formattedData)}> Save</button>
}
