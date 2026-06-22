import type React from "react"

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
		width: "32",
		height: "32",
		stroke: "currentColor",
		fill: "none",
		strokeWidth: 2,
		strokeLinecap: "round",
		strokeLinejoin: "round",
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
			<div className="state-overview__header state-overview__header--indicators">
				<h2 className="state-overview__title">NATIONAL OVERVIEW</h2>
				<p className="state-overview__sub">
					Key indicators of India's progress
				</p>
			</div>
			<div className="state-overview__grid">
				{NATIONAL_OVERVIEW_CARDS.map((card) => (
					<div key={card.key} className="state-overview__card">
						<span
							className="state-overview__icon"
							style={getIconStyles(card.color)}
							aria-hidden
						>
							{renderOverviewIcon(card.key)}
						</span>
						<div className="state-overview__info">
							<span className="state-overview__value">{card.value}</span>
							<span className="state-overview__label">
								{(() => {
									const lastParenIndex = card.label.lastIndexOf(" (")
									if (lastParenIndex !== -1) {
										return (
											<>
												<span className="state-overview__label-main">
													{card.label.substring(0, lastParenIndex)}
												</span>
												<span className="state-overview__label-sub">
													{card.label.substring(lastParenIndex + 1)}
												</span>
											</>
										)
									}
									return (
										<span className="state-overview__label-main">
											{card.label}
										</span>
									)
								})()}
							</span>
						</div>
					</div>
				))}
			</div>
		</>
	)
}
