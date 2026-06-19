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
		<main className="dashboard">
			<Suspense fallback={<div className="gis-map-shell" aria-hidden="true" />}>
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
						onDistrictClick={(districtId) => {
							console.log("[district-selected]", districtId)
						}}
					/>
				</MapEngine>
			</Suspense>

			<div className="dashboard__hud">
				<TopBar />
			</div>
		</main>
	)
}
