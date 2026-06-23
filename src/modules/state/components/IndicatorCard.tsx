import type React from "react"
import { cn } from "@/shared/lib/utils"
import HudIcon from "@/shared/ui/dashboard/HudIcon"
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
			className={cn(
				// Card shell — replaces state-bottom__card
				"panel-card flex flex-col justify-between min-h-[134px] p-[12px_14px] cursor-pointer",
				// Hover — replaces state-bottom__card:hover
				"hover:border-[var(--card-color)] hover:shadow-[0_4px_25px_color-mix(in_srgb,var(--card-color)_30%,transparent),inset_0_1px_1px_rgba(255,255,255,0.12)] hover:-translate-y-[2.5px]",
				// Active state — replaces .state-bottom__card.is-active
				isActive &&
					"bg-[linear-gradient(150deg,color-mix(in_srgb,var(--card-color)_12%,rgba(12,18,28,0.95)),rgba(6,12,20,0.85))] border-[var(--card-color)] shadow-[0_0_20px_color-mix(in_srgb,var(--card-color)_35%,transparent),inset_0_1px_1px_rgba(255,255,255,0.15)] -translate-y-[1.5px]",
			)}
			onClick={onClick}
			style={
				{
					"--card-color": card.color,
				} as React.CSSProperties
			}
		>
			{/* Top row: icon + label + badge */}
			<div className="flex items-center justify-between w-full">
				<div className="flex gap-2 items-center min-w-0">
					{/* HudIcon replaces state-bottom__icon (30×30, rounded-md) */}
					<HudIcon
						size="sm"
						className="!rounded-md"
						style={getIconStyles(card.color)}
						aria-hidden
					>
						{renderIntelIcon(card.key)}
					</HudIcon>
					{/* Label — replaces state-bottom__label */}
					<span className="overflow-hidden text-ellipsis text-[0.86rem] font-bold text-[rgba(255,255,255,0.98)] whitespace-nowrap">
						{card.label}
					</span>
				</div>
				{/* Badge — replaces state-bottom__badge */}
				<span className="px-1.5 py-0.5 text-[0.72rem] font-extrabold leading-none text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.4)] bg-[color-mix(in_srgb,var(--card-color,#3b82f6)_30%,transparent)] border border-[color-mix(in_srgb,var(--card-color,#3b82f6)_65%,transparent)] rounded-md">
					{card.grade}
				</span>
			</div>

			{/* Content row: score + sparkline + delta */}
			<div className="flex flex-1 gap-2 items-end justify-between mt-2.5">
				{/* Score block — replaces state-bottom__score-block */}
				<div className="flex shrink-0 flex-col gap-[3px] items-start">
					{/* Value — replaces state-bottom__value */}
					<span className="text-[1.75rem] font-extrabold leading-none text-white">
						{card.value}
					</span>
					{/* Unit — replaces state-bottom__unit */}
					<span className="mt-1 text-[0.7rem] text-[rgba(205,225,245,0.62)] whitespace-nowrap">
						(Out of 100)
					</span>
				</div>

				{/* Chart block — replaces state-bottom__chart-block */}
				<div className="flex flex-1 flex-col gap-1.5 items-end min-w-0">
					{/* Spark row — replaces state-bottom__spark-row */}
					<div className="w-full h-[44px] py-0.5 mb-0.5 overflow-hidden rounded-md opacity-85 transition-opacity duration-200 ease-in-out group-hover:opacity-100">
						<Sparkline color={card.color} seed={card.value} />
					</div>
					{/* Delta — replaces state-bottom__delta */}
					<span className="text-[0.84rem] font-bold leading-none text-[rgba(0,226,150,0.95)] whitespace-nowrap">
						▲ {card.delta}% {/* vs label — replaces state-bottom__vs */}
						<span className="text-[0.7rem] font-normal text-[rgba(205,225,245,0.62)]">
							vs 2023
						</span>
					</span>
				</div>
			</div>
		</button>
	)
}
