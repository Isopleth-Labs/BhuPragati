import { useMemo } from "react"

export default function Sparkline({
	color,
	seed,
}: {
	color: string
	seed: number
}) {
	const points = useMemo(() => {
		const pts: number[] = []
		let v = 30 + ((seed * 17) % 20)
		for (let i = 0; i < 12; i++) {
			v += Math.sin(seed + i * 1.7) * 8 + 2
			v = Math.max(10, Math.min(55, v))
			pts.push(v)
		}
		return pts.map((y, i) => `${i * 10},${60 - y}`).join(" ")
	}, [seed])

	return (
		<svg
			viewBox="0 0 110 60"
			className="w-full h-full block"
			preserveAspectRatio="none"
		>
			<title id={`sparkline-${seed}`}>Sparkline</title>
			<defs>
				<linearGradient
					id={`sg-${color.replace("#", "")}`}
					x1="0"
					y1="0"
					x2="0"
					y2="1"
				>
					<stop offset="0%" stopColor={color} stopOpacity="0.3" />
					<stop offset="100%" stopColor={color} stopOpacity="0.02" />
				</linearGradient>
			</defs>
			<polygon
				points={`0,60 ${points} 110,60`}
				fill={`url(#sg-${color.replace("#", "")})`}
			/>
			<polyline
				points={points}
				fill="none"
				stroke={color}
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}
