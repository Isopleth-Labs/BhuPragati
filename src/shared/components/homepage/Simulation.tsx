import React, { useEffect, useRef, useState } from "react"
import {
	BtnArrow,
	BtnSecondary,
	Eyebrow,
	SectionBody,
	SectionHeading,
} from "@/shared/components/homepage/shared"
import { cn } from "@/shared/lib/utils"

// ─── Utility: Deterministic Random ───
function srand(seed: number) {
	return Math.abs(Math.sin(seed * 9876.54321)) % 1
}

// ─── Geographic Corridor Network Definition ───
function buildInfrastructureData() {
	const regions: Array<{
		id: number
		x: number
		y: number
		minTier: number
		size: number
		type: string
	}> = []
	const corridors: Array<{
		id: number
		r1: (typeof regions)[0]
		r2: (typeof regions)[0]
		waypoints: Array<{ x: number; y: number }>
		minTier: number
		type: string
		length: number
	}> = []
	let id = 0

	const addRegion = (
		x: number,
		y: number,
		minTier: number,
		size: number,
		type = "hub",
	) => {
		const region = { id: id++, x, y, minTier, size, type }
		regions.push(region)
		return region
	}

	const addCorridor = (
		r1: (typeof regions)[0],
		r2: (typeof regions)[0],
		minTier: number,
		type = "highway",
	) => {
		if (!r1 || !r2) return
		const waypoints: Array<{ x: number; y: number }> = []
		const dist = Math.hypot(r2.x - r1.x, r2.y - r1.y)
		const numWaypoints = Math.max(1, Math.floor(dist / 25))
		for (let i = 1; i < numWaypoints; i++) {
			const t = i / numWaypoints
			const jx = (srand(r1.id + i * 10) - 0.5) * 8
			const jy = (srand(r2.id + i * 10) - 0.5) * 8
			waypoints.push({
				x: r1.x + (r2.x - r1.x) * t + jx,
				y: r1.y + (r2.y - r1.y) * t + jy,
			})
		}
		corridors.push({ id: id++, r1, r2, waypoints, minTier, type, length: dist })
	}

	const delhi = addRegion(60, 25, 0, 1.0, "mega-hub")
	const lucknow = addRegion(90, 35, 0, 0.6, "regional")
	const patna = addRegion(125, 45, 0, 0.7, "regional")
	addCorridor(delhi, lucknow, 0, "highway")
	addCorridor(lucknow, patna, 0, "highway")

	const ahmedabad = addRegion(40, 50, 0, 0.8, "regional")
	const mumbai = addRegion(35, 75, 0, 1.0, "mega-hub")
	addCorridor(delhi, ahmedabad, 0, "highway")
	addCorridor(ahmedabad, mumbai, 0, "highway")

	const kolkata = addRegion(160, 60, 0, 0.9, "mega-hub")
	const guwahati = addRegion(185, 45, 0, 0.5, "regional")
	addCorridor(kolkata, guwahati, 0, "rail")

	const bangalore = addRegion(75, 100, 0, 0.9, "mega-hub")
	const chennai = addRegion(105, 95, 0, 0.8, "regional")
	addCorridor(bangalore, chennai, 0, "highway")

	const nagpur = addRegion(95, 65, 0, 0.4, "settlement")
	const raipur = addRegion(115, 60, 0, 0.3, "settlement")

	const asansol = addRegion(145, 50, 1, 0.5, "settlement")
	addCorridor(patna, asansol, 1, "highway")
	addCorridor(asansol, kolkata, 1, "highway")

	const pune = addRegion(50, 80, 1, 0.6, "regional")
	const belgaum = addRegion(60, 90, 1, 0.4, "settlement")
	addCorridor(mumbai, pune, 1, "highway")
	addCorridor(pune, belgaum, 1, "highway")
	addCorridor(belgaum, bangalore, 1, "highway")

	addRegion(95, 65, 1, 0.7, "regional")
	const hyderabad = addRegion(85, 80, 1, 0.8, "regional")
	addCorridor(delhi, nagpur, 1, "rail")
	addCorridor(nagpur, hyderabad, 1, "rail")
	addCorridor(hyderabad, bangalore, 1, "rail")

	const bhubaneswar = addRegion(135, 75, 2, 0.6, "regional")
	const vizag = addRegion(120, 85, 2, 0.5, "regional")
	const vijayawada = addRegion(105, 90, 2, 0.5, "regional")
	addCorridor(kolkata, bhubaneswar, 2, "highway")
	addCorridor(bhubaneswar, vizag, 2, "highway")
	addCorridor(vizag, vijayawada, 2, "highway")
	addCorridor(vijayawada, chennai, 2, "highway")

	addCorridor(nagpur, raipur, 2, "highway")
	addCorridor(raipur, kolkata, 2, "highway")

	const indore = addRegion(65, 55, 2, 0.6, "regional")
	addCorridor(ahmedabad, indore, 2, "highway")
	addCorridor(indore, nagpur, 2, "highway")
	addCorridor(hyderabad, vijayawada, 2, "highway")

	return { regions, corridors }
}

const INFRA_DATA = buildInfrastructureData()

const THEMES = [
	{ colorRGB: "255, 107, 87", bgColor: "rgba(255, 107, 87, 0.05)" },
	{ colorRGB: "255, 211, 77", bgColor: "rgba(255, 211, 77, 0.08)" },
	{ colorRGB: "39, 255, 208", bgColor: "rgba(39, 255, 208, 0.08)" },
]

function NetworkCanvas({
	stepIndex,
	isHovered,
	onHoverStart,
	onHoverEnd,
}: {
	stepIndex: number
	isHovered: boolean
	onHoverStart: () => void
	onHoverEnd: () => void
}) {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const containerRef = useRef<HTMLDivElement>(null)
	const hoverProgressRef = useRef(0)
	const theme = THEMES[stepIndex]

	useEffect(() => {
		const canvas = canvasRef.current
		const container = containerRef.current
		if (!canvas || !container) return

		const ctx = canvas.getContext("2d")
		if (!ctx) return
		let animationFrameId: number
		let isVisible = true

		const observer = new IntersectionObserver(
			([entry]) => {
				isVisible = entry.isIntersecting
			},
			{ threshold: 0 },
		)
		observer.observe(container)

		let width: number, height: number
		const resize = () => {
			const rect = container.getBoundingClientRect()
			const dpr = Math.min(window.devicePixelRatio || 1, 2)
			width = rect.width
			height = rect.height
			canvas.width = width * dpr
			canvas.height = height * dpr
			ctx.scale(dpr, dpr)
		}
		resize()
		window.addEventListener("resize", resize)

		const mapX = (x: number) => (x / 200) * width * 0.9 + width * 0.05
		const mapY = (y: number) => (y / 120) * height * 0.9 + height * 0.05
		let lastTime = performance.now()

		const render = (time: number) => {
			if (!isVisible) {
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
			ctx.clearRect(0, 0, width, height)

			INFRA_DATA.regions.forEach((reg) => {
				if (reg.minTier <= stepIndex) {
					const cx = mapX(reg.x),
						cy = mapY(reg.y)
					let r = 20 + reg.size * 25
					if (reg.minTier === stepIndex && stepIndex > 0) r *= 0.2 + 0.8 * hp
					else r *= 1.0 + 0.2 * hp
					const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
					const zoneColor =
						reg.minTier === 0 && stepIndex === 0
							? theme.colorRGB
							: reg.minTier === 1 && stepIndex === 1
								? theme.colorRGB
								: stepIndex === 2
									? theme.colorRGB
									: "255,255,255"
					const alpha = reg.minTier === stepIndex ? 0.03 + 0.06 * hp : 0.02
					grad.addColorStop(0, `rgba(${zoneColor}, ${alpha})`)
					grad.addColorStop(0.5, `rgba(${zoneColor}, ${alpha * 0.5})`)
					grad.addColorStop(1, `rgba(${zoneColor}, 0)`)
					ctx.beginPath()
					ctx.fillStyle = grad
					ctx.arc(cx, cy, r, 0, Math.PI * 2)
					ctx.fill()
				}
			})

			ctx.lineCap = "butt"
			ctx.lineJoin = "miter"
			INFRA_DATA.corridors.forEach((c) => {
				if (c.minTier > stepIndex) return
				const path = [c.r1, ...c.waypoints, c.r2]
				const isBuilding = c.minTier === stepIndex && stepIndex > 0
				let lineAlpha = 0.25,
					lineWidth = c.type === "highway" ? 3 : 2,
					isDashed = false,
					drawPercent = 1.0
				if (isBuilding) {
					if (hp < 0.05) {
						isDashed = true
						lineAlpha = 0.15
						lineWidth = 1.5
					} else {
						isDashed = true
						lineAlpha = 0.4 * hp
						lineWidth = 2 + 1 * hp
						drawPercent = hp
					}
				} else {
					lineAlpha = 0.25 + 0.2 * hp
					lineWidth = c.type === "highway" ? 3 + hp : 2 + hp
				}

				const drawPath = (
					percent: number,
					dashArray: number[],
					colorStr: string,
					width: number,
				) => {
					ctx.beginPath()
					ctx.lineWidth = width
					ctx.strokeStyle = colorStr
					ctx.setLineDash(dashArray)
					let totalLen = 0
					const segments: Array<{
						sx: number
						sy: number
						ex: number
						ey: number
						l: number
					}> = []
					for (let i = 0; i < path.length - 1; i++) {
						const sx = mapX(path[i].x),
							sy = mapY(path[i].y),
							ex = mapX(path[i + 1].x),
							ey = mapY(path[i + 1].y)
						const l = Math.hypot(ex - sx, ey - sy)
						segments.push({ sx, sy, ex, ey, l })
						totalLen += l
					}
					const targetLen = totalLen * percent
					let currentLen = 0
					if (segments.length > 0) {
						ctx.moveTo(segments[0].sx, segments[0].sy)
						for (const seg of segments) {
							if (currentLen + seg.l <= targetLen) {
								ctx.lineTo(seg.ex, seg.ey)
								currentLen += seg.l
							} else {
								const p = (targetLen - currentLen) / seg.l
								ctx.lineTo(
									seg.sx + (seg.ex - seg.sx) * p,
									seg.sy + (seg.ey - seg.sy) * p,
								)
								break
							}
						}
					}
					ctx.stroke()
					ctx.setLineDash([])
				}

				const col = isBuilding
					? theme.colorRGB
					: stepIndex === 2
						? theme.colorRGB
						: "180,190,200"
				drawPath(
					drawPercent,
					isDashed ? [6, 6] : [],
					`rgba(${col}, ${lineAlpha})`,
					lineWidth,
				)
				if (!isBuilding && hp > 0.1)
					drawPath(
						1.0,
						[],
						`rgba(${col}, ${lineAlpha * 0.8 * hp})`,
						lineWidth * 0.4,
					)

				if (!isBuilding && hp > 0) {
					const pulseProgress = (time * 0.0005 + c.id * 0.3) % 1
					if (pulseProgress < 1.0) {
						let currentLen = 0,
							totalLen = 0
						const segments: Array<{
							sx: number
							sy: number
							ex: number
							ey: number
							l: number
						}> = []
						for (let i = 0; i < path.length - 1; i++) {
							const sx = mapX(path[i].x),
								sy = mapY(path[i].y),
								ex = mapX(path[i + 1].x),
								ey = mapY(path[i + 1].y)
							const l = Math.hypot(ex - sx, ey - sy)
							segments.push({ sx, sy, ex, ey, l })
							totalLen += l
						}
						const targetLen = totalLen * pulseProgress
						let px = segments[0]?.sx,
							py = segments[0]?.sy
						for (const seg of segments) {
							if (currentLen + seg.l <= targetLen) {
								currentLen += seg.l
							} else {
								const p = (targetLen - currentLen) / seg.l
								px = seg.sx + (seg.ex - seg.sx) * p
								py = seg.sy + (seg.ey - seg.sy) * p
								break
							}
						}
						if (px && py) {
							ctx.beginPath()
							const pulseGlow = ctx.createRadialGradient(px, py, 0, px, py, 15)
							pulseGlow.addColorStop(0, `rgba(${col}, ${0.35 * hp})`)
							pulseGlow.addColorStop(1, `rgba(${col}, 0)`)
							ctx.fillStyle = pulseGlow
							ctx.arc(px, py, 20, 0, Math.PI * 2)
							ctx.fill()
						}
					}
				}
			})

			INFRA_DATA.regions.forEach((reg) => {
				if (reg.minTier > stepIndex) return
				const x = mapX(reg.x),
					y = mapY(reg.y)
				let alpha = 0.6,
					scale = 1.0
				if (reg.minTier === stepIndex && stepIndex > 0) {
					alpha = 0.2 + 0.6 * hp
					scale = 0.5 + 0.5 * hp
				} else {
					alpha = 0.6 + 0.4 * hp
				}
				const baseSize =
					reg.type === "mega-hub" ? 5 : reg.type === "regional" ? 3.5 : 2
				const s = baseSize * scale
				const cRGB =
					reg.minTier === stepIndex
						? theme.colorRGB
						: stepIndex === 2
							? theme.colorRGB
							: "220,230,240"
				ctx.fillStyle = `rgba(${cRGB}, ${alpha})`
				if (reg.type === "mega-hub") {
					ctx.fillRect(x - s, y - s, s * 2, s * 2)
					ctx.fillRect(x - s * 1.5, y + s * 0.2, s, s)
					ctx.fillRect(x + s * 0.5, y - s * 1.5, s, s)
				} else if (reg.type === "regional") {
					ctx.fillRect(x - s, y - s, s * 2, s * 2)
					ctx.beginPath()
					ctx.arc(x, y, s * 0.5, 0, Math.PI * 2)
					ctx.fillStyle = "#0a1018"
					ctx.fill()
				} else {
					ctx.beginPath()
					ctx.arc(x, y, s, 0, Math.PI * 2)
					ctx.fillStyle = `rgba(${cRGB}, ${alpha})`
					ctx.fill()
				}
				if (hp > 0 && reg.type !== "settlement") {
					ctx.beginPath()
					ctx.fillStyle = `rgba(${cRGB}, ${0.15 * hp})`
					ctx.arc(x, y, s * 4, 0, Math.PI * 2)
					ctx.fill()
				}
			})

			animationFrameId = requestAnimationFrame(render)
		}

		animationFrameId = requestAnimationFrame(render)
		return () => {
			cancelAnimationFrame(animationFrameId)
			window.removeEventListener("resize", resize)
			observer.disconnect()
		}
	}, [stepIndex, theme, isHovered])

	return (
		<div
			ref={containerRef}
			className="relative flex items-center justify-center w-full h-[170px] mb-4 overflow-hidden bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.04),transparent_60%)] rounded-[10px] max-[720px]:h-[120px] max-[720px]:mb-3"
		>
			<canvas
				ref={canvasRef}
				className="absolute inset-0 block w-full h-full"
				onMouseEnter={onHoverStart}
				onMouseLeave={onHoverEnd}
			/>
		</div>
	)
}

const STEPS = [
	{
		title: "Current State",
		description: "Identify isolated regions and infrastructure gaps.",
		stepIndex: 0,
	},
	{
		title: "Investment Scenario",
		description: "Plan corridors and bridge critical missing links.",
		stepIndex: 1,
	},
	{
		title: "Projected Outcome",
		description: "Achieve fully connected, resilient infrastructure.",
		stepIndex: 2,
	},
]

const ARROW_COLORS = ["text-[#ff6b57]", "text-[#ffd34d]", "text-[#27ffd0]"]
const ARROW_KEYFRAME_ANIMATIONS = [
	"simArrowPulse 1.5s infinite",
	"simArrowMove 1s ease-in-out infinite alternate",
	"simArrowFlow 0.8s linear infinite",
]

function Simulation() {
	const [hoveredCard, setHoveredCard] = useState(-1)

	return (
		<>
			<style>{`@keyframes simArrowPulse{0%,100%{transform:scale(1);filter:drop-shadow(0 0 2px rgba(255,107,87,0.4))}50%{transform:scale(1.1);filter:drop-shadow(0 0 8px rgba(255,107,87,0.8))}}@keyframes simArrowMove{0%{transform:translateX(0);filter:drop-shadow(0 0 4px rgba(255,211,77,0.6))}100%{transform:translateX(6px);filter:drop-shadow(0 0 8px rgba(255,211,77,0.9))}}@keyframes simArrowFlow{0%{transform:translateX(-2px);opacity:0.5}50%{transform:translateX(3px);opacity:1;filter:drop-shadow(0 0 8px rgba(39,255,208,0.8))}100%{transform:translateX(8px);opacity:0}}`}</style>
			<section
				className="grid [grid-template-columns:360px_minmax(0,1fr)] [column-gap:48px] py-[56px] px-[40px] w-full max-w-[min(1800px,92vw)] mx-auto scroll-mt-20 max-[900px]:[grid-template-columns:1fr] max-[900px]:[row-gap:28px] max-[900px]:py-[36px] max-[900px]:px-[24px] max-[720px]:py-[28px] max-[720px]:px-[18px] max-[480px]:py-[22px] max-[480px]:px-[16px] max-[480px]:[row-gap:20px]"
				id="simulation"
			>
				{/* Left */}
				<div className="self-start flex flex-col gap-4">
					<Eyebrow>DEVELOPMENT SIMULATION</Eyebrow>
					<SectionHeading>Plan Today, Transform Tomorrow</SectionHeading>
					<SectionBody>
						Simulate infrastructure investments and see the projected impact
						before it happens.
					</SectionBody>
					<BtnSecondary
						href="#simulation-tool"
						id="sim-explore-btn"
						className="mt-[18px] self-start"
					>
						<span>EXPLORE SIMULATION</span>
						<BtnArrow />
					</BtnSecondary>
				</div>

				{/* Right: 3-card flow */}
				<div className="self-start w-full min-w-0">
					<div className="grid [grid-template-columns:340px_auto_340px_auto_340px] gap-[40px] items-center justify-center w-full max-[1100px]:[grid-template-columns:1fr_auto_1fr_auto_1fr] max-[720px]:[grid-template-columns:1fr] max-[720px]:[row-gap:14px] max-[720px]:gap-x-0">
						{STEPS.map((step, index) => {
							const isHovered = hoveredCard === index
							return (
								<React.Fragment key={step.title}>
									<article
										className={cn(
											"relative z-[1] box-border flex flex-col gap-[10px] items-center min-h-[320px] p-[12px_12px_18px] text-center max-[720px]:min-h-0 max-[720px]:p-[14px_14px_16px]",
											"bg-[linear-gradient(180deg,rgba(14,20,32,0.78),rgba(7,14,24,0.9))]",
											"border border-[rgba(146,197,255,0.12)] rounded-[12px]",
											"shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_10px_30px_rgba(0,0,0,0.24)]",
											"transition-[transform,border-color,box-shadow] duration-300",
											isHovered &&
												"z-[2] -translate-y-[6px] border-[rgba(146,197,255,0.3)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_15px_40px_rgba(0,0,0,0.35)]",
										)}
										onMouseEnter={() => setHoveredCard(index)}
										onMouseLeave={() => setHoveredCard(-1)}
									>
										<h3 className="m-0 mb-4 text-[15px] font-bold leading-[1.35] text-[#e8eef8]">
											{step.title}
										</h3>
										<NetworkCanvas
											stepIndex={step.stepIndex}
											isHovered={isHovered}
											onHoverStart={() => setHoveredCard(index)}
											onHoverEnd={() => setHoveredCard(-1)}
										/>
										<p className="m-0 text-[13px] leading-[1.5] text-[#9fb0c8] opacity-[0.85]">
											{step.description}
										</p>
									</article>

									{index < STEPS.length - 1 && (
										<span
											aria-hidden="true"
											className={cn(
												"flex items-center justify-center w-6 h-6 transition-all duration-300",
												isHovered
													? ARROW_COLORS[index]
													: "text-[#9fb0c8] opacity-50",
												"max-[720px]:justify-self-center max-[720px]:rotate-90",
											)}
											style={
												isHovered
													? { animation: ARROW_KEYFRAME_ANIMATIONS[index] }
													: undefined
											}
										>
											<svg
												className="w-5 h-5 transition-all duration-300"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="1.5"
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<title>Arrow Right</title>
												<line x1="5" y1="12" x2="19" y2="12" />
												<polyline points="12 5 19 12 12 19" />
											</svg>
										</span>
									)}
								</React.Fragment>
							)
						})}
					</div>
				</div>
			</section>
		</>
	)
}

export default Simulation
