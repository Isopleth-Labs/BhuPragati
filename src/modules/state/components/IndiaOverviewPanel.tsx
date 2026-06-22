import type React from "react"
import DemographicsPanel from "./DemographicsPanel"
import InfrastructureSummaryPanel from "./InfrastructureSummaryPanel"
import NationalOverviewPanel from "./NationalOverviewPanel"

const STATS_CARDS = [
	{ key: "states", label: "States & UTs", value: "28 + 8", color: "#3b82f6" },
	{
		key: "population",
		label: "Total Population",
		value: "1.42B+",
		color: "#3b82f6",
	},
	{ key: "area", label: "Total Area", value: "3.28M km²", color: "#10b981" },
	{ key: "gdp", label: "GDP (Nominal)", value: "₹273.4L Cr", color: "#f59e0b" },
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

function renderStatsIcon(key: string) {
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
		case "states":
			return (
				<svg
					viewBox="4.8 2.5 16.5 16.5"
					fill="currentColor"
					width="32"
					height="32"
				>
					<title id="States & UTs">States & UTs</title>
					<path d="M12.5 3c-.5 0-.9.3-1.2.7l-.4.8c-.2.4-.6.6-1 .6H9c-.4 0-.8.2-1 .5L7.2 7c-.2.3-.2.7 0 1l.5.8c.2.3.3.6.2.9l-.2.8c0 .2 0 .4.1.5l.8.8c.2.2.3.5.3.8v1.2c0 .4.2.7.5.9l1.8.8c.3.1.5.4.5.7l.1 1.2c0 .4.3.7.7.8l2 .3c.4 0 .8-.2.9-.6l.3-1.2c.1-.3.3-.5.6-.6h1.2c.4 0 .7-.3.8-.7l.1-.8c0-.3-.1-.6-.3-.8l-.8-.8c-.2-.2-.3-.5-.3-.8v-1c0-.4.2-.7.5-.9l1-.8c.3-.2.4-.6.4-1V7.5c0-.4-.2-.8-.5-1l-1-.7c-.3-.2-.7-.2-1 0l-.8.5c-.3.2-.7.2-1 0l-.8-.8c-.2-.2-.5-.3-.8-.3z" />
				</svg>
			)
		case "population":
			return (
				<svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
					<title id="Population">Population</title>
					<path d="M9 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm8.5-2c1.66 0 3-1.34 3-3s-1.34-3-3-3c-.43 0-.84.09-1.2.26 1.09 1.41 1.09 3.07 0 4.48.36.17.77.26 1.2.26zm0 2c1.33 0 4 .67 4 2v2h-5.5v-2c0-1.04-.46-1.95-1.19-2.58.9-.27 1.83-.42 2.69-.42z" />
				</svg>
			)
		case "area":
			return (
				<svg viewBox="0 0 24 24" {...commonProps}>
					<title id="Area">Area</title>
					<polygon
						points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"
						fill="currentColor"
						fillOpacity="0.15"
					/>
					<line x1="9" y1="3" x2="9" y2="18" />
					<line x1="15" y1="6" x2="15" y2="21" />
				</svg>
			)
		case "gdp":
			return (
				<svg viewBox="0 0 24 24" {...commonProps}>
					<title id="GDP">GDP</title>
					<circle
						cx="12"
						cy="12"
						r="10"
						fill="currentColor"
						fillOpacity="0.15"
					/>
					<path d="M8 8h8" />
					<path d="M8 11h8" />
					<path d="M12 11c2.5 0 3.5-3 0-3" />
					<path d="M11 11l-3 6" />
				</svg>
			)
		default:
			return null
	}
}

export default function IndiaOverviewPanel() {
	return (
		<section
			className="panel-surface state-main__right"
			aria-label="India overview"
		>
			<div className="state-overview__header">
				<h2 className="state-overview__title">INDIA OVERVIEW</h2>
				<p className="state-overview__sub">
					National level key statistics (2024)
				</p>
			</div>

			<div className="state-overview__stats-grid">
				{STATS_CARDS.map((card) => (
					<div key={card.key} className="state-overview__stats-card">
						<span
							className="state-overview__stats-icon"
							style={getIconStyles(card.color)}
							aria-hidden
						>
							{renderStatsIcon(card.key)}
						</span>
						<div className="state-overview__stats-info">
							<span className="state-overview__stats-value">{card.value}</span>
							<span className="state-overview__stats-label">
								<span className="state-overview__stats-label-main">
									{card.label}
								</span>
							</span>
						</div>
					</div>
				))}
			</div>

			<div className="state-panel__section-separator" aria-hidden />

			<NationalOverviewPanel />

			<div className="state-panel__section-separator" aria-hidden />

			<DemographicsPanel />

			<InfrastructureSummaryPanel />

			<div className="state-overview__source-block">
				<div className="state-overview__source-left">
					<span className="state-overview__source-label">Source</span>
					<p className="state-overview__source-text">
						Ministry of Statistics &amp; Programme Implementation, India |
						Various Ministries &amp; Govt. Sources
					</p>
				</div>
				<div className="state-overview__source-divider" aria-hidden />
				<div className="state-overview__source-right">
					<span className="state-overview__updated-label">Last Updated</span>
					<span className="state-overview__updated-value">20 May 2024</span>
				</div>
			</div>
		</section>
	)
}
