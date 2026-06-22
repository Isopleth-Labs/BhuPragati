import { useState } from "react"
import { ParameterPanel } from "./simulation/ParameterPanel"
import { ScenarioCards } from "./simulation/ScenarioCards"
import { SimulationHeader } from "./simulation/SimulationHeader"
import { TelemetryPanel } from "./simulation/TelemetryPanel"

function Simulation() {
	const [hoveredCard, setHoveredCard] = useState<number | null>(null)

	return (
		<section className="section-row simulation" id="simulation">
			<SimulationHeader />

			<ScenarioCards
				hoveredCard={hoveredCard}
				setHoveredCard={setHoveredCard}
			/>

			<TelemetryPanel />

			<ParameterPanel />
		</section>
	)
}

export default Simulation
