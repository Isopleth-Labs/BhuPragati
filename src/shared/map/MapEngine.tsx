import maplibregl, { type LngLatBoundsLike } from "maplibre-gl"
import {
	forwardRef,
	memo,
	type PropsWithChildren,
	useCallback,
	useRef,
} from "react"
import MapGL, {
	AttributionControl,
	type MapRef,
	NavigationControl,
	ScaleControl,
} from "react-map-gl/maplibre"
import "maplibre-gl/dist/maplibre-gl.css"
import { useFitView } from "@/shared/hooks/useFitView"
import {
	INITIAL_VIEW_STATE,
	MAP_MAX_BOUNDS,
	MAP_STYLE_URL,
	MAP_ZOOM_LIMITS,
} from "@/shared/lib/config/mapConfig"

interface MapEngineProps extends PropsWithChildren {
	regionId: string
	onMapReady?: () => void
	maxBounds?: LngLatBoundsLike
	zoomLimits?: { min: number; max: number }
	initialViewState?: {
		center: [number, number]
		zoom: number
		pitch?: number
		bearing?: number
	}
}

const MapEngine = forwardRef<MapRef | null, MapEngineProps>(
	(
		{ regionId, onMapReady, maxBounds, zoomLimits, initialViewState, children },
		ref,
	) => {
		const mapRef = useRef<MapRef | null>(null)

		const setMapRef = useCallback(
			(instance: MapRef | null) => {
				mapRef.current = instance
				if (typeof ref === "function") ref(instance)
				else if (ref) ref.current = instance
			},
			[ref],
		)

		const view = initialViewState ?? INITIAL_VIEW_STATE

		useFitView(mapRef, regionId, onMapReady)

		return (
			<div
				className="
			fixed inset-0 z-0 overflow-hidden
			bg-[#02050a]
			[background:radial-gradient(circle_at_50%_48%,rgba(255,64,45,0.12),transparent_18%),radial-gradient(circle_at_54%_52%,rgba(0,112,170,0.16),transparent_44%),#02050a]
			
			/* MapLibre Popup Custom Skin Overrides */
			[&_.maplibregl-popup]:z-[4]
			[&_.maplibregl-popup-content]:p-0
			[&_.maplibregl-popup-content]:overflow-hidden
			[&_.maplibregl-popup-content]:text-white
			[&_.maplibregl-popup-content]:bg-[rgba(4,10,16,0.92)]
			[&_.maplibregl-popup-content]:border
			[&_.maplibregl-popup-content]:border-[#ff5844]/34
			[&_.maplibregl-popup-content]:rounded-lg
			[&_.maplibregl-popup-content]:shadow-[0_18px_60px_rgba(0,0,0,0.52),0_0_28px_rgba(255,59,47,0.12)]
			[&_.maplibregl-popup-content]:backdrop-blur-[18px]
			
			[&_.maplibregl-popup-tip]:border-t-[rgba(4,9,16,0.92)]
			[&_.maplibregl-popup-tip]:border-b-[rgba(4,9,16,0.92)]
		"
			>
				<MapGL
					ref={setMapRef}
					mapLib={maplibregl}
					mapStyle={MAP_STYLE_URL}
					initialViewState={{
						longitude: view.center[0],
						latitude: view.center[1],
						zoom: view.zoom,
						pitch: view.pitch ?? 0,
						bearing: view.bearing ?? 0,
					}}
					maxBounds={(maxBounds ?? MAP_MAX_BOUNDS) as LngLatBoundsLike}
					minZoom={(zoomLimits ?? MAP_ZOOM_LIMITS).min}
					maxZoom={(zoomLimits ?? MAP_ZOOM_LIMITS).max}
					attributionControl={false}
				>
					<AttributionControl position="bottom-right" compact />
					<NavigationControl position="top-right" visualizePitch />
					<ScaleControl unit="metric" position="bottom-right" />
					{children}
				</MapGL>
			</div>
		)
	},
)

MapEngine.displayName = "MapEngine"

export default memo(MapEngine)
