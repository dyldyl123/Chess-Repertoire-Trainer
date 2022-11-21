import savePosition from "../utils/savePosition"

export default function SaveEditMode({ pgn }) {
	return <button onClick={() => savePosition(1, pgn)}> Save</button>
}
