import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { Suspense, useState } from "react"
import StateIntelligenceDashboard from "#/modules/state/StateIntelligenceDashboard"
import {
	INDIA_INITIAL_VIEW_STATE,
	INDIA_ZOOM_LIMITS,
} from "#/shared/lib/config/mapConfig"
import { ChoroplethUpdateController } from "#/shared/map/controllers/ChoroplethUpdateController"
import { LabelTuningController } from "#/shared/map/controllers/LabelTuningController"
import { StateSelector } from "#/shared/map/controllers/StateSelector"
import { StateBoundaryLayer } from "#/shared/map/layers/StateBoundaryLayer"
import { INDIA_MAX_BOUNDS } from "#/shared/map/MapConstraints"
import MapEngine from "#/shared/map/MapEngine"

export const Route = createFileRoute("/state-map")({
	component: StateMapPage,
})

function StateMapPage() {
	const navigate = useNavigate()

	const [activeIndicator, setActiveIndicator] = useState("overall")
	const [selectedStateId, setSelectedStateId] = useState<string | null>(null)
	const [resolvedMode, setResolvedMode] = useState<"day" | "night">("night")
	const [stateLayerReady, setStateLayerReady] = useState(false)

	const handleStateClick = (stateId: string) => {
		navigate({
			to: "/map",
			search: { state: stateId },
		})
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
				<StateSelector
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
