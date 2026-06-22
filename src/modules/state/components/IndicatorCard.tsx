import type React from "react"
import Sparkline from "./Sparkline"

interface CardData {
	key: string
	label: string
	value: number
	grade: string
	delta: number
	color: string
}

interface IndicatorCardProps {
	card: CardData
	isActive: boolean
	onClick: () => void
}

function getIconStyles(color: string) {
	let darkBg = "rgba(12, 30, 68, 0.75)"
	if (color === "#10b981" || color === "#22c55e") {
		darkBg = "rgba(8, 38, 26, 0.75)"
	} else if (color === "#f59e0b") {
		darkBg = "rgba(45, 30, 8, 0.75)"
	} else if (color === "#ef4444") {
		darkBg = "rgba(45, 12, 12, 0.75)"
	} else if (color === "#8b5cf6") {
		darkBg = "rgba(30, 15, 55, 0.75)"
	} else if (
		color === "#06b6d4" ||
		color === "#0ea5e9" ||
		color === "#3b82f6"
	) {
		if (color === "#3b82f6") {
			darkBg = "rgba(12, 30, 68, 0.75)"
		} else {
			darkBg = "rgba(8, 35, 45, 0.75)"
		}
	}
	return {
		color: color,
		"--icon-border": `${color}4d`,
		"--icon-bg": darkBg,
		"--icon-glow": `${color}40`,
	} as React.CSSProperties
}

function renderIntelIcon(key: string) {
	const commonProps = {
		width: "18",
		height: "18",
		stroke: "currentColor",
		fill: "none",
		strokeWidth: 2,
		strokeLinecap: "round" as const,
		strokeLinejoin: "round" as const,
	}
	switch (key) {
		case "population":
			return (
				<svg viewBox="0 0 24 24" {...commonProps}>
					<title id="Population">Population</title>
					<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
					<circle cx="9" cy="7" r="4" />
					<path d="M23 21v-2a4 4 0 0 0-3-3.87" />
					<path d="M16 3.13a4 4 0 0 1 0 7.75" />
				</svg>
			)
		case "infrastructure":
			return (
				<svg viewBox="0 0 24 24" {...commonProps}>
					<title id="Infrastructure">Infrastructure</title>
					<rect
						x="2"
						y="10"
						width="7"
						height="11"
						rx="1"
						fill="currentColor"
						fillOpacity="0.15"
					/>
					<rect
						x="9"
						y="3"
						width="7"
						height="18"
						rx="1"
						fill="currentColor"
						fillOpacity="0.15"
					/>
					<rect
						x="16"
						y="8"
						width="6"
						height="13"
						rx="1"
						fill="currentColor"
						fillOpacity="0.15"
					/>
				</svg>
			)
		case "health":
			return (
				<svg viewBox="0 0 24 24" {...commonProps}>
					<title id="Health">Health</title>
					<path d="M22 12h-4l-3 9L9 3l-3 9H2" />
				</svg>
			)
		case "education":
			return (
				<svg viewBox="0 0 24 24" {...commonProps}>
					<title id="Education">Education</title>
					<path
						d="M22 10L12 5L2 10l10 5 10-5z"
						fill="currentColor"
						fillOpacity="0.15"
					/>
					<path d="M6 12v5c0 2 2.5 3 6 3s6-1 6-3v-5" />
				</svg>
			)
		case "agriculture":
			return (
				<svg viewBox="0 0 24 24" {...commonProps}>
					<title id="Agriculture">Agriculture</title>
					<path
						d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 9.8a7 7 0 0 1-9 8.2Z"
						fill="currentColor"
						fillOpacity="0.15"
					/>
					<path d="M9 22v-4" />
				</svg>
			)
		case "connectivity":
			return (
				<svg viewBox="0 0 24 24" {...commonProps}>
					<title id="Connectivity">Connectivity</title>
					<circle cx="18" cy="5" r="3" fill="currentColor" fillOpacity="0.15" />
					<circle cx="6" cy="12" r="3" fill="currentColor" fillOpacity="0.15" />
					<circle
						cx="18"
						cy="19"
						r="3"
						fill="currentColor"
						fillOpacity="0.15"
					/>
					<line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
					<line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
				</svg>
			)
		case "power":
			return (
				<svg viewBox="0 0 24 24" {...commonProps}>
					<title id="Power">Power</title>
					<polygon
						points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"
						fill="currentColor"
						fillOpacity="0.15"
					/>
				</svg>
			)
		default:
			return null
	}
}

export default function IndicatorCard({
	card,
	isActive,
	onClick,
}: IndicatorCardProps) {
	return (
		<button
			type="button"
			className={`state-bottom__card${isActive ? " is-active" : ""}`}
			onClick={onClick}
			style={
				{
					"--card-color": card.color,
					cursor: "pointer",
				} as React.CSSProperties
			}
		>
			<div className="state-bottom__top">
				<div className="state-bottom__top-left">
					<span
						className="state-bottom__icon"
						style={getIconStyles(card.color)}
						aria-hidden
					>
						{renderIntelIcon(card.key)}
					</span>
					<span className="state-bottom__label">{card.label}</span>
				</div>
				<span className="state-bottom__badge">{card.grade}</span>
			</div>
			<div className="state-bottom__content">
				<div className="state-bottom__score-block">
					<span className="state-bottom__value">{card.value}</span>
					<span className="state-bottom__unit">(Out of 100)</span>
				</div>
				<div className="state-bottom__chart-block">
					<div className="state-bottom__spark-row">
						<Sparkline color={card.color} seed={card.value} />
					</div>
					<span className="state-bottom__delta">
						▲ {card.delta}% <span className="state-bottom__vs">vs 2023</span>
					</span>
				</div>
			</div>
		</button>
	)
}
