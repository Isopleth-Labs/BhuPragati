import { Fragment } from "react"

type InfoIcon = "landmark" | "house" | "database" | "cpu" | "shield"

const INFO_STRIP_ITEMS: {
	icon: InfoIcon
	color: string
	title: string
	subtitle: string
	variant: string
}[] = [
	{
		icon: "landmark",
		color: "#8bd5ff",
		title: "100% District Coverage",
		subtitle: "All 767 Districts",
		variant: "coverage",
	},
	{
		icon: "house",
		color: "#f4c26b",
		title: "6.4 Lakh+ Villages",
		subtitle: "Complete Rural Coverage",
		variant: "villages",
	},
	{
		icon: "database",
		color: "#7ad1a5",
		title: "200+ Data Parameters",
		subtitle: "Multi-Source Integration",
		variant: "data",
	},
	{
		icon: "cpu",
		color: "#c5a5ff",
		title: "AI-Powered Insights",
		subtitle: "Smart Decision Support",
		variant: "ai",
	},
	{
		icon: "shield",
		color: "#6fd0ff",
		title: "Secure & Reliable",
		subtitle: "Government Grade Security",
		variant: "security",
	},
]

function renderFeatureIcon(icon: InfoIcon) {
	const commonProps = {
		className: "feature-icon__svg",
		stroke: "currentColor",
		fill: "none",
		strokeWidth: 1.7,
		strokeLinecap: "round" as const,
		strokeLinejoin: "round" as const,
	}
	switch (icon) {
		case "landmark":
			return (
				<svg viewBox="0 0 24 24" {...commonProps}>
					<title id="Landmark">Landmark</title>
					<path d="M4 10h16" />
					<path d="M6 10v6" />
					<path d="M10 10v6" />
					<path d="M14 10v6" />
					<path d="M18 10v6" />
					<path d="M3 18h18" />
					<path d="M12 4 4 8h16z" />
				</svg>
			)
		case "house":
			return (
				<svg viewBox="0 0 24 24" {...commonProps}>
					<title id="House">House</title>
					<path d="m3 11 9-7 9 7" />
					<path d="M5 10v9h14v-9" />
					<path d="M10 19v-5h4v5" />
				</svg>
			)
		case "database":
			return (
				<svg viewBox="0 0 24 24" {...commonProps}>
					<title id="Database">Database</title>
					<ellipse cx="12" cy="5" rx="7" ry="3" />
					<path d="M5 5v14c0 1.7 3.1 3 7 3s7-1.3 7-3V5" />
					<path d="M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3" />
				</svg>
			)
		case "cpu":
			return (
				<svg viewBox="0 0 24 24" {...commonProps}>
					<title id="CPU">CPU</title>
					<rect x="7" y="7" width="10" height="10" rx="2" />
					<path d="M10 2v3" />
					<path d="M14 2v3" />
					<path d="M10 19v3" />
					<path d="M14 19v3" />
					<path d="M2 10h3" />
					<path d="M2 14h3" />
					<path d="M19 10h3" />
					<path d="M19 14h3" />
				</svg>
			)
		case "shield":
			return (
				<svg viewBox="0 0 24 24" {...commonProps}>
					<title id="Shield">Shield</title>
					<path d="M12 3 5 6v6c0 4 3 7 7 9 4-2 7-5 7-9V6z" />
					<path d="m9.5 12.5 2 2 3-3" />
				</svg>
			)
		default:
			return null
	}
}

export default function CapabilityStrip() {
	return (
		<div className="state-bottom__features">
			<div className="feature-strip-grid">
				{INFO_STRIP_ITEMS.map((item, index) => (
					<Fragment key={item.title}>
						<div
							className={`state-feature feature-item feature-${item.variant}`}
						>
							<span
								className="state-feature__icon feature-icon icon-card"
								style={{ color: item.color }}
								aria-hidden
							>
								{renderFeatureIcon(item.icon)}
							</span>
							<div className="feature-text">
								<div className="feature-title">{item.title}</div>
								<div className="feature-subtitle">{item.subtitle}</div>
							</div>
						</div>
						{index < INFO_STRIP_ITEMS.length - 1 && (
							<span className="feature-divider" aria-hidden />
						)}
					</Fragment>
				))}
			</div>
		</div>
	)
}
