import { useState } from "react"
import { ParameterPanel } from "./simulation/ParameterPanel"
import { ScenarioCards } from "./simulation/ScenarioCards"
import { SimulationHeader } from "./simulation/SimulationHeader"
import { TelemetryPanel } from "./simulation/TelemetryPanel"

function Simulation() {
	const [hoveredCard, setHoveredCard] = useState<number | null>(null)

	return (
		<section
			className=" relative grid grid-cols-[360px_minmax(0,1fr)] gap-[48px] items-center max-w-[min(1800px,92vw)] w-full mx-auto my-0 px-[40px] py-[56px] max-[1080px]:grid-cols-1 max-[1080px]:items-start max-[1080px]:gap-[54px] max-[760px]:py-[80px]"
			id="simulation"
		>
			<SimulationHeader />

			<div className=" w-full">
				<ScenarioCards
					hoveredCard={hoveredCard}
					setHoveredCard={setHoveredCard}
				/>

				<TelemetryPanel />

				<ParameterPanel />
			</div>
		</section>
	)
}

export default Simulation
