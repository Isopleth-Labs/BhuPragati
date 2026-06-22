import { Suspense, useState } from "react"
import { DistrictSelectionController } from "#/shared/map/controllers/DistrictSelectionController"
import { FeaturePopupController } from "#/shared/map/controllers/FeaturePopupController"
import { FocusPulseController } from "#/shared/map/controllers/FocusPulseController"
import { IntelligenceSoftenController } from "#/shared/map/controllers/IntelligenceSoftenController"
import { LabelTuningController } from "#/shared/map/controllers/LabelTuningController"
import { LazyMapEngine as MapEngine } from "#/shared/map/LazyMapEngine"
import { AdministrativeBoundaryLayer } from "#/shared/map/layers/AdministrativeBoundaryLayer"
import { BasemapLayer } from "#/shared/map/layers/BasemapLayer"
import { CommandCenterLayer } from "#/shared/map/layers/CommandCenterLayer"
import { DistrictBoundaryLayer } from "#/shared/map/layers/DistrictBoundaryLayer"
import { InfrastructureLayer } from "#/shared/map/layers/InfrastructureLayer"
import { OsmOverlayLayer } from "#/shared/map/layers/OsmOverlayLayer"
import useActiveLayers from "@/shared/hooks/useActiveLayers"
import {
	BIHAR_INITIAL_VIEW_STATE,
	BIHAR_MAX_BOUNDS,
	BIHAR_ZOOM_LIMITS,
} from "@/shared/lib/config/mapConfig"
import TopBar from "./panels/TopBar"

export default function DashboardShell() {
	const { activeLayers } = useActiveLayers()
	const [infraReady, setInfraReady] = useState(false)
	const [districtReady, setDistrictReady] = useState(false)

	return (
		<main className="dashboard relative w-full h-screen overflow-hidden isolate bg-[#02050a] [&_.gis-map-shell]:absolute [&_.gis-map-shell]:inset-0 [&_.gis-map-shell]:z-0 [&_.gis-map-shell]:overflow-hidden">
			<Suspense
				fallback={
					<div
						className="gis-map-shell absolute inset-0 z-0 overflow-hidden"
						aria-hidden="true"
					/>
				}
			>
				<MapEngine
					regionId="bihar"
					initialViewState={BIHAR_INITIAL_VIEW_STATE}
					maxBounds={BIHAR_MAX_BOUNDS}
					zoomLimits={BIHAR_ZOOM_LIMITS}
				>
					<BasemapLayer />
					<LabelTuningController />
					<AdministrativeBoundaryLayer />
					<OsmOverlayLayer />
					<InfrastructureLayer
						activeLayers={activeLayers}
						onReady={() => setInfraReady(true)}
					/>
					<IntelligenceSoftenController ready={infraReady} />
					<FocusPulseController ready={infraReady} />
					<FeaturePopupController ready={infraReady} />
					<CommandCenterLayer />
					<DistrictBoundaryLayer onReady={() => setDistrictReady(true)} />
					<DistrictSelectionController
						ready={districtReady}
						onDistrictClick={(_districtId) => {
							// reserved for future selection state
						}}
					/>
				</MapEngine>
			</Suspense>

			<div className="dashboard__hud absolute inset-[22px_28px] z-10 pointer-events-none [&>*]:pointer-events-auto flex justify-end items-start">
				<TopBar />
			</div>
		</main>
	)
}
