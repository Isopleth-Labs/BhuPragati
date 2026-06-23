import { Suspense, useState } from "react"
import { ChoroplethUpdateController } from "#/shared/map/controllers/ChoroplethUpdateController"
import { LabelTuningController } from "#/shared/map/controllers/LabelTuningController"
import { StateSelectionController } from "#/shared/map/controllers/StateSelectionController"
import { LazyMapEngine as MapEngine } from "#/shared/map/LazyMapEngine"
import { StateBoundaryLayer } from "#/shared/map/layers/StateBoundaryLayer"
import {
	INDIA_INITIAL_VIEW_STATE,
	INDIA_MAX_BOUNDS,
	INDIA_ZOOM_LIMITS,
} from "@/shared/lib/config/mapConfig"
import StateIntelligenceDashboard from "./StateIntelligenceDashboard"

import StateMapOverlays from "./StateMapOverlays"

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
		<Suspense
			fallback={
				<div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_40%)]" />
			}
		>
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
				<StateMapOverlays
					activeIndicator={activeIndicator}
					onReset={() => setSelectedStateId(null)}
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
