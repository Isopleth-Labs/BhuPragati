import { memo } from "react"

// Compact inline SVG icons for the tactical layer set.
// Strokes use currentColor so they inherit the layer accent.

const ICONS = {
	flood: (
		<>
			<path d="M3 9c2 0 2-1.5 4-1.5S9 9 11 9s2-1.5 4-1.5S17 9 19 9" />
			<path d="M3 13c2 0 2-1.5 4-1.5S9 13 11 13s2-1.5 4-1.5S17 13 19 13" />
			<path d="M3 17c2 0 2-1.5 4-1.5S9 17 11 17s2-1.5 4-1.5S17 17 19 17" />
		</>
	),
	roads: (
		<>
			<path d="M11 3 4 20h14L11 3z" />
			<path d="M11 9v2" />
			<path d="M11 14v2" />
		</>
	),
	healthcare: (
		<>
			<path d="M9 3h4v6h6v4h-6v6H9v-6H3V9h6V3z" />
		</>
	),
	agriculture: (
		<>
			<path d="M11 21c0-6 4-11 10-11-1 6-5 11-10 11z" />
			<path d="M11 21c0-5-3-9-8-9 1 5 4 9 8 9z" />
			<path d="M11 21V11" />
		</>
	),
	electricity: (
		<>
			<path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
		</>
	),
}

type IconKey = keyof typeof ICONS

function LayerIcon({
	iconKey,
	size = 18,
	strokeWidth = 1.6,
}: {
	iconKey: IconKey
	size?: number
	strokeWidth?: number
}) {
	const path = ICONS[iconKey as IconKey]
	if (!path) return null
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 22 22"
			fill="none"
			stroke="currentColor"
			strokeWidth={strokeWidth}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			{path}
		</svg>
	)
}

export default memo(LayerIcon)
