
interface Rectangle {
	width :number
	height :number
}

export function resizeBounds(original:Rectangle, bounds:Rectangle) : Rectangle {
	let widthRatio = 1.0 * original.width / bounds.width;
	let heightRatio = 1.0 * original.height / bounds.height;

	let higherRatio = Math.max(widthRatio, heightRatio);

	if (higherRatio > 1) {
		return {
			width: original.width / higherRatio,
			height: original.height / higherRatio
		}
	} else {
		return original
	}
}