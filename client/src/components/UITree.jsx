import TreeView, { flattenTree } from "react-accessible-treeview"

export default function UITree({ parsedRavPgn }) {
	if (parsedRavPgn[0]?.moves?.length === 0) {
		return <p>nothing</p>
	}
	class Node {
		constructor(move, parent = null) {
			this.name = move?.notation?.notation
			this.children = []
			if (parent) {
				parent.children.push(this)
			}
		}
	}

	const treeify = (moves) => {
		let result = []
		let [first, ...rest] = moves
		const firstNode = new Node(first)
		result.push(firstNode)

		for (let move of rest) {
			new Node(move, firstNode)
			if (move.variations) {
				for (let variation of move?.variations) {
					firstNode.children = [...firstNode.children, ...treeify(variation)]
				}
			}
		}

		for (let variation of first?.variations) {
			result.push(...treeify(variation))
		}

		return result
	}

	if (parsedRavPgn && parsedRavPgn[0]?.moves?.length > 0) {
		const treeData = flattenTree({
			children: treeify(parsedRavPgn[0]?.moves),
		})

		return (
			<TreeView
				data={treeData}
				className="basic"
				aria-label="basic example tree"
				nodeRenderer={({ element, getNodeProps, level, handleSelect }) => (
					<div {...getNodeProps()} style={{ paddingLeft: 20 * (level - 1) }}>
						{element.name}
					</div>
				)}
			/>
		)
	} else {
		return <p>Loading...</p>
	}
}
