import { Suspense, useState } from "react"
import { ChoroplethUpdateController } from "@/modules/map/controllers/ChoroplethUpdateController"
import { LabelTuningController } from "@/modules/map/controllers/LabelTuningController"
import { StateSelectionController } from "@/modules/map/controllers/StateSelectionController"
import { LazyMapEngine as MapEngine } from "@/modules/map/LazyMapEngine"
import { StateBoundaryLayer } from "@/modules/map/layers/StateBoundaryLayer"
import {
	INDIA_INITIAL_VIEW_STATE,
	INDIA_MAX_BOUNDS,
	INDIA_ZOOM_LIMITS,
} from "@/shared/lib/config/mapConfig"
import StateIntelligenceDashboard from "./StateIntelligenceDashboard"

interface StateMapShellProps {
	onBiharDrillDown: () => void
}

export default function StateMapShell({
	onBiharDrillDown,
}: StateMapShellProps) {
	const [activeIndicator, setActiveIndicator] = useState("overall")
	const [selectedStateId, setSelectedStateId] = useState<string | null>(null)
	const [resolvedMode, setResolvedMode] = useState<"day" | "night">("night")
	const [stateLayerReady, setStateLayerReady] = useState(false)

	const handleStateClick = (stateId: string) => {
		if (stateId === "bihar") {
			onBiharDrillDown()
			return
		}
		setSelectedStateId(stateId)
	}

	const handleToggleTheme = () => {
		setResolvedMode((prev) => (prev === "night" ? "day" : "night"))
	}

	const mapSlot = (
		<Suspense fallback={<div className="state-map__fallback" />}>
			<MapEngine
				regionId="india"
				initialViewState={INDIA_INITIAL_VIEW_STATE}
				maxBounds={INDIA_MAX_BOUNDS}
				zoomLimits={INDIA_ZOOM_LIMITS}
			>
				<LabelTuningController />
				<StateBoundaryLayer onReady={() => setStateLayerReady(true)} />
				<ChoroplethUpdateController
					activeIndicator={activeIndicator}
					ready={stateLayerReady}
				/>
				<StateSelectionController
					ready={stateLayerReady}
					onStateClick={handleStateClick}
				/>
			</MapEngine>
		</Suspense>
	)

	return (
		<StateIntelligenceDashboard
			activeIndicator={activeIndicator}
			onSetIndicator={setActiveIndicator}
			selectedStateId={selectedStateId}
			onStateClick={handleStateClick}
			resolvedMode={resolvedMode}
			onToggleTheme={handleToggleTheme}
			mapSlot={mapSlot}
		/>
	)
}
