function tree(arr) {
	let output = []
	for (let item of arr) {
		console.log(item)
		let bob = item.split(" ")
		output.push(...bob)
	}
	console.log(output)
}

tree(["e4 e6", "e4 d5"])
