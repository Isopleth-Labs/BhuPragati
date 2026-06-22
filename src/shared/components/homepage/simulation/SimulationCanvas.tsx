import { useEffect, useRef } from "react"
import { runCanvasEffects } from "./canvas/CanvasEffects"
import { setupCanvasSize } from "./canvas/CanvasSizing"
import { useCanvasVisibility } from "./canvas/CanvasVisibility"
import { drawNetwork } from "./canvas/NetworkRenderer"

interface NetworkCanvasProps {
	stepIndex: number
	isHovered: boolean
	onHoverStart: () => void
	onHoverEnd: () => void
}

export function NetworkCanvas({
	stepIndex,
	isHovered,
	onHoverStart,
	onHoverEnd,
}: NetworkCanvasProps) {
	const canvasRef = useRef<HTMLCanvasElement | null>(null)
	const containerRef = useRef<HTMLDivElement | null>(null)
	const hoverProgressRef = useRef(0)

	const isVisibleRef = useCanvasVisibility(containerRef)

	useEffect(() => {
		const canvas = canvasRef.current
		const container = containerRef.current
		if (!canvas || !container) return

		const ctx = canvas.getContext("2d")
		if (!ctx) return

		let width = 0
		let height = 0

		const sizing = setupCanvasSize(canvas, container, (w, h) => {
			width = w
			height = h
		})

		const effects = runCanvasEffects(
			isVisibleRef,
			isHovered,
			hoverProgressRef,
			(time, hp) => {
				drawNetwork(ctx, width, height, stepIndex, hp, time)
			},
		)

		return () => {
			sizing.cleanup()
			effects.cleanup()
		}
	}, [stepIndex, isHovered, isVisibleRef])

	return (
		<div className="sim-card__visual" ref={containerRef}>
			<canvas
				ref={canvasRef}
				className="sim-card__canvas"
				onMouseEnter={onHoverStart}
				onMouseLeave={onHoverEnd}
			/>
		</div>
	)
}
