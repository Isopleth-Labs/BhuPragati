import type React from "react"
import HudIcon from "@/shared/ui/dashboard/HudIcon"
import MetricPanel from "@/shared/ui/dashboard/MetricPanel"

const NATIONAL_OVERVIEW_CARDS = [
	{ key: "road", label: "Road Network", value: "6.31M km", color: "#f59e0b" },
	{ key: "rail", label: "Rail Network", value: "67,956 km", color: "#3b82f6" },
	{ key: "airports", label: "Airports", value: "153", color: "#8b5cf6" },
	{ key: "urban", label: "Urban Population", value: "37.7%", color: "#06b6d4" },
	{ key: "forest", label: "Forest Cover", value: "21.7%", color: "#10b981" },
	{ key: "languages", label: "Languages", value: "35", color: "#10b981" },
]

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

function renderOverviewIcon(key: string) {
	const commonProps: React.SVGProps<SVGSVGElement> = {
		width: "26",
		height: "26",
		stroke: "currentColor",
		fill: "none",
		strokeWidth: 2,
		strokeLinecap: "round",
		strokeLinejoin: "round",
		className: "block w-[26px] h-[26px]",
	}
	switch (key) {
		case "road":
			return (
				<svg viewBox="0 0 24 24" {...commonProps}>
					<title id="Roads">Roads</title>
					<path d="M6 2L3 22h18L18 2z" fill="currentColor" fillOpacity="0.15" />
					<line x1="12" y1="5" x2="12" y2="7" />
					<line x1="12" y1="11" x2="12" y2="13" />
					<line x1="12" y1="17" x2="12" y2="19" />
				</svg>
			)
		case "rail":
			return (
				<svg viewBox="0 0 24 24" {...commonProps}>
					<title id="Railways">Railways</title>
					<rect
						x="4"
						y="3"
						width="16"
						height="15"
						rx="2"
						fill="currentColor"
						fillOpacity="0.15"
					/>
					<path d="M4 11h16" />
					<path d="M8 15h.01" strokeWidth="3" />
					<path d="M16 15h.01" strokeWidth="3" />
					<path d="M6 18l-2 3" />
					<path d="M18 18l2 3" />
				</svg>
			)
		case "airports":
			return (
				<svg viewBox="0 0 24 24" {...commonProps}>
					<title id="Airports">Airports</title>
					<path
						d="M21 16V14L13 9V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z"
						fill="currentColor"
						fillOpacity="0.15"
					/>
				</svg>
			)
		case "urban":
			return (
				<svg viewBox="0 0 24 24" {...commonProps}>
					<title id="Urban">Urban</title>
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
		case "forest":
			return (
				<svg viewBox="0 0 24 24" {...commonProps}>
					<title id="Forest">Forest</title>
					<path d="M12 20v-4" />
					<path
						d="M17.6 15A6 6 0 0 0 12 6a6 6 0 0 0-5.6 9 4 4 0 0 0 1.6 7.6h8a4 4 0 0 0 1.6-7.6Z"
						fill="currentColor"
						fillOpacity="0.15"
					/>
				</svg>
			)
		case "languages":
			return (
				<svg viewBox="0 0 24 24" {...commonProps}>
					<title id="Languages">Languages</title>
					<path d="M5 8l6 6" />
					<path d="M4 14l6-6 2-3" />
					<path d="M2 5h12" />
					<path d="M7 2h1" />
					<path d="M22 22l-5-10-5 10" fill="currentColor" fillOpacity="0.15" />
					<path d="M14 18h6" />
				</svg>
			)
		default:
			return null
	}
}

export default function NationalOverviewPanel() {
	return (
		<>
			<div className="flex flex-col gap-0.5 pl-0.5 mb-1 mt-2.5">
				<h2 className="m-0 font-['Plus_Jakarta_Sans',Inter,sans-serif] text-[15.5px] font-extrabold text-white uppercase tracking-[0.04em] [text-shadow:0_0_12px_rgba(169,200,255,0.35),0_0_30px_rgba(100,150,255,0.15)]">
					NATIONAL OVERVIEW
				</h2>
				<p className="m-0 text-[11.5px] font-medium leading-[1.2] text-[rgba(255,255,255,0.72)]">
					Key indicators of India's progress
				</p>
			</div>
			<div className="grid grid-cols-3 auto-rows-[94px] gap-2.5">
				{NATIONAL_OVERVIEW_CARDS.map((card) => (
					<MetricPanel
						key={card.key}
						className="box-border items-center justify-center h-[94px] p-[6px_4px] text-center hover:bg-[linear-gradient(135deg,rgba(16,28,56,0.75)_0%,rgba(6,12,28,0.8)_100%)] hover:border-[rgba(56,189,248,0.45)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.08),0_0_10px_rgba(56,189,248,0.1)] hover:-translate-y-[1.5px] transition-all duration-220 ease-[cubic-bezier(0.4,0,0.2,1)] group"
					>
						<HudIcon
							size="md"
							style={getIconStyles(card.color)}
							className="group-hover:border-[var(--icon-border,rgba(120,160,220,0.35))] group-hover:shadow-[0_0_18px_var(--icon-glow,var(--icon-bg)),inset_0_1px_1px_rgba(255,255,255,0.2)] group-hover:scale-[1.03] transition-all duration-220 ease-[cubic-bezier(0.4,0,0.2,1)]"
							aria-hidden
						>
							{renderOverviewIcon(card.key)}
						</HudIcon>
						<div className="flex flex-col gap-0.5 items-center w-full min-w-0">
							<span className="block font-['Plus_Jakarta_Sans',Inter,sans-serif] text-[17.5px] font-extrabold leading-[1.1] text-white text-center tracking-[-0.01em] whitespace-nowrap [text-shadow:0_2px_8px_rgba(255,255,255,0.06)]">
								{card.value}
							</span>
							<span className="flex flex-col gap-0.5 items-center w-full">
								{(() => {
									const lastParenIndex = card.label.lastIndexOf(" (")
									if (lastParenIndex !== -1) {
										return (
											<>
												<span className="block font-['Plus_Jakarta_Sans',Inter,sans-serif] text-[11px] font-bold leading-[1.25] text-[rgba(255,255,255,0.96)] text-center tracking-[-0.015em] transition-colors duration-200 group-hover:text-white">
													{card.label.substring(0, lastParenIndex)}
												</span>
												<span className="block font-['Plus_Jakarta_Sans',Inter,sans-serif] text-[9.5px] font-bold leading-[1.1] text-[rgba(255,255,255,0.75)] text-center tracking-[-0.01em] transition-colors duration-200 group-hover:text-[rgba(255,255,255,0.8)]">
													{card.label.substring(lastParenIndex + 1)}
												</span>
											</>
										)
									}
									return (
										<span className="block font-['Plus_Jakarta_Sans',Inter,sans-serif] text-[11px] font-bold leading-[1.25] text-[rgba(255,255,255,0.96)] text-center tracking-[-0.015em] transition-colors duration-200 group-hover:text-white">
											{card.label}
										</span>
									)
								})()}
							</span>
						</div>
					</MetricPanel>
				))}
			</div>
		</>
	)
}
