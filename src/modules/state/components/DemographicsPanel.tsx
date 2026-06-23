import type React from "react"
import HudIcon from "@/shared/ui/dashboard/HudIcon"
import MetricPanel from "@/shared/ui/dashboard/MetricPanel"

const DEMOGRAPHIC_CARDS = [
	{ key: "literacy", label: "Literacy Rate", value: "77.7%", color: "#3b82f6" },
	{ key: "hospitals", label: "Hospitals", value: "1.5L+", color: "#ef4444" },
	{ key: "schools", label: "Schools", value: "14.9L+", color: "#8b5cf6" },
	{
		key: "gdpPerCapita",
		label: "GDP Per Capita",
		value: "₹2.0L",
		color: "#f59e0b",
	},
	{ key: "districts", label: "Districts", value: "767", color: "#f59e0b" },
	{ key: "coastline", label: "Coastline", value: "7,516 km", color: "#06b6d4" },
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
		case "literacy":
			return (
				<svg viewBox="0 0 24 24" {...commonProps}>
					<title id="Literacy">Literacy</title>
					<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
					<path
						d="M4 4h16v13H6.5A2.5 2.5 0 0 0 4 19.5V4z"
						fill="currentColor"
						fillOpacity="0.15"
					/>
					<path d="M8 8h8" />
					<path d="M8 12h5" />
				</svg>
			)
		case "hospitals":
			return (
				<svg viewBox="0 0 24 24" {...commonProps}>
					<title id="Hospitals">Hospitals</title>
					<rect
						x="3"
						y="3"
						width="18"
						height="18"
						rx="2"
						fill="currentColor"
						fillOpacity="0.15"
					/>
					<path d="M12 8v8" />
					<path d="M8 12h8" />
				</svg>
			)
		case "schools":
			return (
				<svg viewBox="0 0 24 24" {...commonProps}>
					<title id="Schools">Schools</title>
					<path
						d="M22 10L12 5L2 10l10 5 10-5z"
						fill="currentColor"
						fillOpacity="0.15"
					/>
					<path d="M6 12v5c0 2 2.5 3 6 3s6-1 6-3v-5" />
					<path d="M22 10v6" />
				</svg>
			)
		case "gdpPerCapita":
			return (
				<svg viewBox="0 0 24 24" {...commonProps}>
					<title id="GDP per Capita">GDP per Capita</title>
					<circle cx="12" cy="8" r="4" fill="currentColor" fillOpacity="0.15" />
					<path d="M5 20v-1a7 7 0 0 1 14 0v1" />
					<path d="M12 14v3" />
					<path d="M10 16h4" />
				</svg>
			)
		case "districts":
			return (
				<svg viewBox="0 0 24 24" {...commonProps}>
					<title id="Districts">Districts</title>
					<rect
						x="3"
						y="3"
						width="7"
						height="7"
						rx="1"
						fill="currentColor"
						fillOpacity="0.15"
					/>
					<rect
						x="14"
						y="3"
						width="7"
						height="7"
						rx="1"
						fill="currentColor"
						fillOpacity="0.15"
					/>
					<rect
						x="3"
						y="14"
						width="7"
						height="7"
						rx="1"
						fill="currentColor"
						fillOpacity="0.15"
					/>
					<rect
						x="14"
						y="14"
						width="7"
						height="7"
						rx="1"
						fill="currentColor"
						fillOpacity="0.15"
					/>
				</svg>
			)
		case "coastline":
			return (
				<svg viewBox="0 0 24 24" {...commonProps}>
					<title id="Coastline">Coastline</title>
					<path d="M2 12c2-2.5 4-2.5 6 0s4 2.5 6 0 4-2.5 6 0" />
					<path d="M2 17c2-2.5 4-2.5 6 0s4 2.5 6 0 4-2.5 6 0" />
					<path d="M2 7c2-2.5 4-2.5 6 0s4 2.5 6 0 4-2.5 6 0" />
				</svg>
			)
		default:
			return null
	}
}

export default function DemographicsPanel() {
	return (
		<>
			<div className="flex flex-col gap-0.5 pl-0.5 mb-1 mt-2.5">
				<h2 className="m-0 font-['Plus_Jakarta_Sans',Inter,sans-serif] text-[15.5px] font-extrabold text-white uppercase tracking-[0.04em] [text-shadow:0_0_12px_rgba(169,200,255,0.35),0_0_30px_rgba(100,150,255,0.15)]">
					DEMOGRAPHICS &amp; SERVICES
				</h2>
				<p className="m-0 text-[11.5px] font-medium leading-[1.2] text-[rgba(255,255,255,0.72)]">
					Population and public services
				</p>
			</div>
			<div className="grid grid-cols-3 auto-rows-[94px] gap-2.5">
				{DEMOGRAPHIC_CARDS.map((card) => (
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
