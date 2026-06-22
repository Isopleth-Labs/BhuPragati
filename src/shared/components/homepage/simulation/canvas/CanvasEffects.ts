import type { RefObject } from "react"

export function runCanvasEffects(
	isVisibleRef: RefObject<boolean>,
	isHovered: boolean,
	hoverProgressRef: RefObject<number>,
	onFrame: (time: number, hp: number) => void,
) {
	let animationFrameId: number | undefined
	let lastTime = performance.now()

	const render = (time: number) => {
		if (!isVisibleRef.current) {
			lastTime = time
			animationFrameId = requestAnimationFrame(render)
			return
		}

		const dt = time - lastTime
		lastTime = time

		hoverProgressRef.current += (isHovered ? 1 : -1) * dt * 0.003
		hoverProgressRef.current = Math.max(
			0,
			Math.min(1, hoverProgressRef.current),
		)
		const hp = hoverProgressRef.current

		onFrame(time, hp)

		animationFrameId = requestAnimationFrame(render)
	}

	animationFrameId = requestAnimationFrame(render)

	return {
		cleanup: () => {
			if (animationFrameId !== undefined) {
				cancelAnimationFrame(animationFrameId)
			}
		},
	}
}
