import HudPanel from "@/shared/ui/dashboard/HudPanel"
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
		<HudPanel
			as="section"
			aria-label="Key Development Indicators"
			// Replaces: panel-surface + state-bottom + state-bottom (2nd decl)
			// grid-column: 1/-1 is handled by the parent dashboard grid
			className="!rounded-xl flex flex-col shrink-0 gap-2 col-[1/-1] p-[10px_12px] m-[8px_16px_16px_16px] overflow-hidden"
		>
			{/* Replaces: panel-kicker (inlined to Tailwind) */}
			<p className="m-0 mb-1.5 font-sans text-[0.74rem] font-bold text-[rgba(195,220,245,0.9)] uppercase tracking-[0.12em]">
				Key Development Indicators
			</p>

			{/* Replaces: state-bottom__grid */}
			<div className="grid flex-1 grid-cols-[repeat(7,1fr)] gap-3">
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
		</HudPanel>
	)
}
