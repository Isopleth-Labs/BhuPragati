import CapabilityStrip from "./CapabilityStrip"
import IndicatorCard from "./IndicatorCard"

const INTEL_CARDS = [
	{
		key: "population",
		label: "Population Index",
		value: 72.4,
		grade: "B+",
		delta: 1.36,
		icon: "population",
		color: "#3b82f6",
	},
	{
		key: "infrastructure",
		label: "Infrastructure Index",
		value: 64.8,
		grade: "B",
		delta: 2.18,
		icon: "infrastructure",
		color: "#f59e0b",
	},
	{
		key: "health",
		label: "Health Index",
		value: 62.4,
		grade: "B-",
		delta: 1.45,
		icon: "health",
		color: "#ef4444",
	},
	{
		key: "education",
		label: "Education Index",
		value: 68.7,
		grade: "B",
		delta: 2.18,
		icon: "education",
		color: "#8b5cf6",
	},
	{
		key: "agriculture",
		label: "Agriculture Index",
		value: 60.1,
		grade: "B-",
		delta: 1.95,
		icon: "agriculture",
		color: "#22c55e",
	},
	{
		key: "connectivity",
		label: "Connectivity Index",
		value: 72.8,
		grade: "B+",
		delta: 2.72,
		icon: "connectivity",
		color: "#0ea5e9",
	},
	{
		key: "power",
		label: "Power Coverage",
		value: 99.1,
		grade: "A-",
		delta: 1.15,
		icon: "power",
		color: "#eab308",
	},
]

interface IndicatorStripProps {
	activeIndicator: string
	onCardClick: (cardKey: string) => void
}

export default function IndicatorStrip({
	activeIndicator,
	onCardClick,
}: IndicatorStripProps) {
	return (
		<section
			className="panel-surface state-bottom"
			aria-label="Key Development Indicators"
		>
			<p className="panel-kicker">Key Development Indicators</p>
			<div className="state-bottom__grid">
				{INTEL_CARDS.map((card) => {
					const isActive = activeIndicator === card.key
					return (
						<IndicatorCard
							key={card.key}
							card={card}
							isActive={isActive}
							onClick={() => onCardClick(card.key)}
						/>
					)
				})}
			</div>
			<CapabilityStrip />
		</section>
	)
}
