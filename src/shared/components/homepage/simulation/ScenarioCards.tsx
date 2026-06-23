import type React from "react"
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
		<div className=" grid grid-cols-3 justify-center items-stretch gap-8 w-full [@media(max-width:1024px)]:grid-cols-1 [@media(max-width:1024px)]:gap-[14px]">
			{STEPS.map((step, index) => {
				const isHovered = hoveredCard === index
				let arrowClass =
					"sim-flow__arrow flex shrink-0 items-center justify-center w-12 h-12 opacity-60 text-[rgba(255,255,255,0.15)] transition-colors duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] [@media(min-width:1025px)]:absolute [@media(min-width:1025px)]:top-1/2 [@media(min-width:1025px)]:-translate-y-1/2 [@media(min-width:1025px)]:-right-[16px] [@media(min-width:1025px)]:translate-x-1/2 [@media(max-width:1024px)]:relative [@media(max-width:1024px)]:my-2 [@media(max-width:1024px)]:rotate-90 z-10"
				if (isHovered) {
					if (index === 0)
						arrowClass +=
							" sim-flow__arrow--pulse-red text-[#ff503c] drop-shadow-[0_0_12px_rgba(255,80,60,0.8)] animate-sim-arrow-pulse"
					if (index === 1)
						arrowClass +=
							" sim-flow__arrow--move-yellow text-[#ffd76a] drop-shadow-[0_0_12px_rgba(255,215,106,0.8)] animate-sim-arrow-move"
				}

				return (
					<div
						key={step.title}
						className="relative flex flex-col items-center w-full h-full"
					>
						<article
							className=" w-full min-h-[340px] flex flex-col p-6 text-center bg-[rgba(8,12,20,0.4)] border border-[rgba(255,255,255,0.06)] rounded-[12px] shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[6px] hover:bg-[rgba(12,19,32,0.6)] hover:border-[rgba(146,197,255,0.3)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4),_0_0_24px_rgba(106,209,255,0.1),_inset_0_1px_0_rgba(255,255,255,0.1)]"
							onMouseEnter={() => setHoveredCard(index)}
							onMouseLeave={() => setHoveredCard(null)}
						>
							<h3 className=" mb-[16px] font-barlow text-[14px] font-bold text-[#eef7ff] uppercase tracking-[0.08em] border-b border-[rgba(255,255,255,0.08)] pb-[12px]">
								{step.title}
							</h3>

							<NetworkCanvas
								stepIndex={step.stepIndex}
								isHovered={isHovered}
								onHoverStart={() => setHoveredCard(index)}
								onHoverEnd={() => setHoveredCard(null)}
							/>

							<p className=" m-0 mt-6 font-inter text-[12px] leading-[1.6] text-[#b8cadc]">
								{step.description}
							</p>
						</article>

						{index < STEPS.length - 1 && (
							<span className={arrowClass} aria-hidden="true">
								<svg
									className=" w-[100%] h-[100%] transition-all duration-300 stroke-current stroke-[1.5] filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
									viewBox="0 0 24 24"
									fill="none"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<title>Arrow Right</title>
									<line x1="5" y1="12" x2="19" y2="12" />
									<polyline points="12 5 19 12 12 19" />
								</svg>
							</span>
						)}
					</div>
				)
			})}
		</div>
	)
}
