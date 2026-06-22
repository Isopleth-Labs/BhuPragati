export function setupCanvasSize(
	canvas: HTMLCanvasElement,
	container: HTMLDivElement,
	onResize: (width: number, height: number) => void,
) {
	const ctx = canvas.getContext("2d")
	const resize = () => {
		const rect = container.getBoundingClientRect()
		const dpr = Math.min(window.devicePixelRatio || 1, 2)
		const width = rect.width
		const height = rect.height
		canvas.width = width * dpr
		canvas.height = height * dpr
		if (ctx) {
			ctx.scale(dpr, dpr)
		}
		onResize(width, height)
	}

	resize()
	window.addEventListener("resize", resize)

	return {
		cleanup: () => {
			window.removeEventListener("resize", resize)
		},
	}
}
