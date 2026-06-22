import { INFRA_DATA, THEMES } from "./InfrastructureData"

export function drawNetwork(
	ctx: CanvasRenderingContext2D,
	width: number,
	height: number,
	stepIndex: number,
	hp: number,
	time: number,
) {
	const theme = THEMES[stepIndex]

	ctx.clearRect(0, 0, width, height)

	const mapX = (x: number) => (x / 200) * width * 0.9 + width * 0.05
	const mapY = (y: number) => (y / 120) * height * 0.9 + height * 0.05

	// --- Draw Coverage Zones (Heatmap underlay) ---
	INFRA_DATA.regions.forEach((reg) => {
		if (reg.minTier <= stepIndex) {
			const cx = mapX(reg.x)
			const cy = mapY(reg.y)
			// Base coverage radius based on size and tier
			let r = 20 + reg.size * 25
			// If this region was just added in this step, animate its coverage radius
			if (reg.minTier === stepIndex && stepIndex > 0) {
				r *= 0.2 + 0.8 * hp
			} else {
				// Existing regions expand coverage on hover
				r *= 1.0 + 0.2 * hp
			}

			const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
			// Color based on tier: Tier 0 regions use theme color, etc.
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

	// --- Draw Corridors ---
	ctx.lineCap = "butt"
	ctx.lineJoin = "miter"

	INFRA_DATA.corridors.forEach((c) => {
		if (c.minTier > stepIndex) return

		const path = [c.r1, ...c.waypoints, c.r2]

		const isBuilding = c.minTier === stepIndex && stepIndex > 0

		// Define route appearance
		let lineAlpha = 0.25
		let lineWidth = c.type === "highway" ? 3 : 2
		let isDashed = false
		let drawPercent = 1.0

		if (isBuilding) {
			// New corridors animate in on hover
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
			// Existing corridors get brighter on hover
			lineAlpha = 0.25 + 0.2 * hp
			lineWidth = c.type === "highway" ? 3 + hp : 2 + hp
		}

		// Helper to draw the path
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
			const segments: {
				sx: number
				sy: number
				ex: number
				ey: number
				l: number
			}[] = []
			for (let i = 0; i < path.length - 1; i++) {
				const sx = mapX(path[i].x),
					sy = mapY(path[i].y)
				const ex = mapX(path[i + 1].x),
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

		// Draw Base Route
		drawPath(
			drawPercent,
			isDashed ? [6, 6] : [],
			`rgba(${col}, ${lineAlpha})`,
			lineWidth,
		)

		// Draw Core highlight for existing routes on hover
		if (!isBuilding && hp > 0.1) {
			drawPath(
				1.0,
				[],
				`rgba(${col}, ${lineAlpha * 0.8 * hp})`,
				lineWidth * 0.4,
			)
		}

		// Draw Light Pulses (Infrastructure Flow) instead of particles
		if (!isBuilding && hp > 0) {
			// A thick glow sweeping along the path
			const pulseProgress = (time * 0.0005 + c.id * 0.3) % 1
			const pulseLen = 0.15 // 15% of the path length

			// Draw a segment of the path
			if (pulseProgress < 1.0) {
				const _startP = Math.max(0, pulseProgress - pulseLen)
				const _endP = pulseProgress

				// We can simulate this by drawing the full path with a line-dash that offsets,
				// but calculating the exact segment is better.
				// For simplicity, let's just use a radial gradient at the moving point.
				let currentLen = 0
				let totalLen = 0
				const segments: {
					sx: number
					sy: number
					ex: number
					ey: number
					l: number
				}[] = []
				for (let i = 0; i < path.length - 1; i++) {
					const sx = mapX(path[i].x),
						sy = mapY(path[i].y)
					const ex = mapX(path[i + 1].x),
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

	// --- Draw Regional Settlements / Hubs ---
	INFRA_DATA.regions.forEach((reg) => {
		if (reg.minTier > stepIndex) return

		const x = mapX(reg.x)
		const y = mapY(reg.y)

		let alpha = 0.6
		let scale = 1.0

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

		// Draw city as a small cluster of blocks rather than a circle
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

		// Glow for active hubs
		if (hp > 0 && reg.type !== "settlement") {
			ctx.beginPath()
			ctx.fillStyle = `rgba(${cRGB}, ${0.15 * hp})`
			ctx.arc(x, y, s * 4, 0, Math.PI * 2)
			ctx.fill()
		}
	})
}
