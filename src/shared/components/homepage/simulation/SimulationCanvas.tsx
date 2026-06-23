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

	let visualBgClass = ""
	if (stepIndex === 0)
		visualBgClass =
			"bg-gradient-to-br from-[rgba(106,209,255,0.15)] to-[rgba(12,19,36,0.8)] border border-[rgba(106,209,255,0.1)]"
	if (stepIndex === 1)
		visualBgClass =
			"bg-gradient-to-br from-[rgba(255,159,67,0.15)] to-[rgba(12,19,36,0.8)] border border-[rgba(255,159,67,0.1)]"
	if (stepIndex === 2)
		visualBgClass =
			"bg-gradient-to-br from-[rgba(124,243,197,0.15)] to-[rgba(12,19,36,0.8)] border border-[rgba(124,243,197,0.1)]"

	return (
		<div
			className={`relative flex items-center justify-center w-full h-[170px] mb-[16px] bg-center bg-cover overflow-hidden rounded-[10px] [@media(max-width:720px)]:h-[120px] [@media(max-width:720px)]:mb-[12px] ${visualBgClass}`}
			ref={containerRef}
		>
			<canvas
				ref={canvasRef}
				className=" absolute inset-0 w-full h-full pointer-events-auto z-10"
				onMouseEnter={onHoverStart}
				onMouseLeave={onHoverEnd}
			/>
		</div>
	)
}
