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
		<main
			className="
        relative h-full w-full overflow-hidden isolate
        [background:radial-gradient(circle_at_50%_42%,rgba(255,53,40,0.14),transparent_20%),radial-gradient(circle_at_75%_20%,rgba(0,126,190,0.13),transparent_28%),#02050a]
      "
		>
			<Suspense
				fallback={
					<div
						className="
              fixed inset-0 z-0 overflow-hidden
              bg-[#02050a]
              [background:radial-gradient(circle_at_50%_48%,rgba(255,64,45,0.12),transparent_18%),radial-gradient(circle_at_54%_52%,rgba(0,112,170,0.16),transparent_44%),#02050a]
            "
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
						onDistrictClick={(districtId) => {
							console.log("[district-selected]", districtId)
						}}
					/>
				</MapEngine>
			</Suspense>

			<div
				className="
          pointer-events-none
          absolute z-[2]
          inset-[22px_28px]

          grid
          grid-rows-[auto_minmax(0,1fr)_auto]
          grid-cols-[minmax(290px,320px)_minmax(0,1fr)_minmax(280px,320px)]
          gap-y-[22px]
          gap-x-[28px]

          max-[1180px]:grid-cols-[minmax(280px,320px)_minmax(220px,1fr)]

          max-[820px]:
            inset-3
            flex
            min-h-0
            max-h-[calc(100%-24px)]
            flex-col
            gap-3
            overflow-x-hidden
            overflow-y-auto
            pb-3
        "
			>
				<div
					className="
            pointer-events-auto
            row-[1]
            col-[3]
            self-start

            max-[1180px]:col-[2]
          "
				>
					<TopBar />
				</div>
			</div>
		</main>
	)
}
