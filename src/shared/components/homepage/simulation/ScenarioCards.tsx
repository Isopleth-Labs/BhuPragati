import React from "react"
import { NetworkCanvas } from "./SimulationCanvas"

const STEPS = [
	{
		title: "Current State",
		description: "Identify isolated regions and infrastructure gaps.",
		stepIndex: 0,
	},
	{
		title: "Investment Scenario",
		description: "Plan corridors and bridge critical missing links.",
		stepIndex: 1,
	},
	{
		title: "Projected Outcome",
		description: "Achieve fully connected, resilient infrastructure.",
		stepIndex: 2,
	},
]

interface ScenarioCardsProps {
	hoveredCard: number | null
	setHoveredCard: React.Dispatch<React.SetStateAction<number | null>>
}

export function ScenarioCards({
	hoveredCard,
	setHoveredCard,
}: ScenarioCardsProps) {
	return (
		<div className="simulation__right">
			<div className="sim-flow">
				{STEPS.map((step, index) => {
					const isHovered = hoveredCard === index
					let arrowClass = "sim-flow__arrow"
					if (isHovered) {
						if (index === 0) arrowClass += " sim-flow__arrow--pulse-red"
						if (index === 1) arrowClass += " sim-flow__arrow--move-yellow"
						if (index === 2) arrowClass += " sim-flow__arrow--flow-cyan"
					}

					return (
						<React.Fragment key={step.title}>
							<article
								className="sim-card"
								onMouseEnter={() => setHoveredCard(index)}
								onMouseLeave={() => setHoveredCard(null)}
							>
								<h3 className="sim-card__title">{step.title}</h3>

								<NetworkCanvas
									stepIndex={step.stepIndex}
									isHovered={isHovered}
									onHoverStart={() => setHoveredCard(index)}
									onHoverEnd={() => setHoveredCard(null)}
								/>

								<p className="sim-card__desc">{step.description}</p>
							</article>

							{index < STEPS.length - 1 && (
								<span className={arrowClass} aria-hidden="true">
									<svg
										className="sim-flow__arrow-svg"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<title>Arrow Right</title>
										<line x1="5" y1="12" x2="19" y2="12" />
										<polyline points="12 5 19 12 12 19" />
									</svg>
								</span>
							)}
						</React.Fragment>
					)
				})}
			</div>
		</div>
	)
}
