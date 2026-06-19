import type { Map as MaplibreMap } from "maplibre-gl"
import { useEffect } from "react"
import { STATE_INDICATORS_DATA } from "@/data/state-indicators"
import { resolveBoundaryProvider } from "@/shared/boundary/registry"
import {
	addLayer,
	addSource,
	getFirstSymbolLayerId,
} from "@/shared/lib/utils/utils"
import {
	STATE_FILL_LAYER,
	STATE_FILL_SOURCE,
	STATE_LABEL_LAYER,
	STATE_LABEL_SOURCE,
	STATE_OUTLINE_LAYER,
} from "@/shared/selectors"
import { useMapReady } from "../hooks/useMapReady"

// Populated during mount. Exported for StateSelectionController to resolve
// string state IDs → numeric MapLibre feature IDs for setFeatureState calls.
// Must be module-level (not component state) so it outlives re-renders.
export const stateIdToNumericId: Record<string, number> = {}

type IndicatorKey = keyof (typeof STATE_INDICATORS_DATA)[string]["metrics"]

function getMinMax(indicator: IndicatorKey): { min: number; max: number } {
	const scores = Object.values(STATE_INDICATORS_DATA).map(
		(s) => s.metrics[indicator] ?? 60,
	)
	return { min: Math.min(...scores), max: Math.max(...scores) }
}

function applyChoroplethScores(
	map: MaplibreMap,
	indicator: IndicatorKey,
): void {
	const { min, max } = getMinMax(indicator)
	for (const [id, numericId] of Object.entries(stateIdToNumericId)) {
		const entry = STATE_INDICATORS_DATA[id]
		if (!entry) continue
		const raw = entry.metrics[indicator] ?? 60
		const score = max > min ? ((raw - min) / (max - min)) * 100 : 50
		map.setFeatureState({ source: STATE_FILL_SOURCE, id: numericId }, { score })
	}
}

// Call after regionId or indicator changes in DashboardShell.
// Map must be ready and india-states layers must be mounted before calling.
export function updateChoroplethForIndicator(
	map: MaplibreMap,
	indicator: string,
): void {
	if (!map.getSource(STATE_FILL_SOURCE)) return
	applyChoroplethScores(map, indicator as IndicatorKey)
}

interface StateBoundaryLayerProps {
	onReady?: () => void
}

// Renders 3 layers over india.geojson via BoundaryProvider:
//   india-states-fill    — choropleth fill (feature-state.score, fallback 50 = mid-blue)
//   india-states-outline — hover-reactive white border
//   india-states-label   — state name from name_en at label_coordinate position
//
// This component is render-only. No click/hover handling here — that lives
// in StateSelectionController (Phase C).
export function StateBoundaryLayer({ onReady }: StateBoundaryLayerProps) {
	const map = useMapReady()

	useEffect(() => {
		if (!map) return
		let cancelled = false

		;(async () => {
			const provider = resolveBoundaryProvider("state")
			const source = await provider.getSourceDescriptor("state")
			if (cancelled || !source || source.type !== "geojson" || !source.data)
				return

			const data = source.data as GeoJSON.FeatureCollection

			// Numeric .id must be assigned before addSource — MapLibre requires
			// features to have .id set at source creation time for setFeatureState.
			data.features.forEach((f, idx) => {
				const numericId = idx + 1
				f.id = numericId
				const stateId = (f.properties as { id?: string }).id
				if (stateId) stateIdToNumericId[stateId] = numericId
			})

			addSource(map, STATE_FILL_SOURCE, data)

			// Initialize choropleth scores once source exists.
			// Normalizes each state's indicator score to 0–100 across the full range
			// so the fill-color interpolation spans the whole palette, not just mid-blue.
			applyChoroplethScores(map, "overall")

			// Separate point source from label_coordinate (not centroid) — guarantees
			// exactly one label per state regardless of MultiPolygon geometry.
			const labelFeatures: GeoJSON.Feature[] = data.features.map((f) => {
				const p = f.properties as {
					id: string
					name_en: string
					label_coordinate: [number, number]
					label_tier: number
				}
				return {
					type: "Feature",
					id: f.id as number,
					geometry: { type: "Point", coordinates: p.label_coordinate },
					properties: {
						id: p.id,
						name_en: p.name_en,
						label_tier: p.label_tier,
					},
				}
			})

			addSource(map, STATE_LABEL_SOURCE, {
				type: "FeatureCollection",
				features: labelFeatures,
			} as GeoJSON.GeoJSON)

			const beforeSymbol = getFirstSymbolLayerId(map)

			addLayer(
				map,
				{
					id: STATE_FILL_LAYER,
					type: "fill",
					source: STATE_FILL_SOURCE,
					paint: {
						"fill-color": [
							"interpolate",
							["linear"],
							["coalesce", ["feature-state", "score"], 50],
							0,
							"#081F5C",
							25,
							"#0E4DB3",
							50,
							"#1F8EDB",
							75,
							"#23B68B",
							100,
							"#F4A300",
						],
						"fill-opacity": [
							"case",
							["boolean", ["feature-state", "hover"], false],
							0.92,
							0.86,
						],
					},
				},
				beforeSymbol,
			)

			addLayer(
				map,
				{
					id: STATE_OUTLINE_LAYER,
					type: "line",
					source: STATE_FILL_SOURCE,
					paint: {
						"line-color": [
							"case",
							["boolean", ["feature-state", "hover"], false],
							"rgba(255,255,255,0.95)",
							"rgba(255,255,255,0.18)",
						],
						"line-width": [
							"case",
							["boolean", ["feature-state", "hover"], false],
							2.0,
							0.8,
						],
						"line-opacity": 1.0,
					},
				},
				beforeSymbol,
			)

			// Label layer added without beforeId — goes above fill/outline, below
			// any later layers that want to render on top.
			addLayer(map, {
				id: STATE_LABEL_LAYER,
				type: "symbol",
				source: STATE_LABEL_SOURCE,
				layout: {
					"text-field": ["get", "name_en"],
					"text-font": ["Noto Sans Regular"],
					"text-allow-overlap": true,
					"text-ignore-placement": true,
					"text-size": [
						"match",
						["get", "id"],
						[
							"rajasthan",
							"maharashtra",
							"uttar-pradesh",
							"madhya-pradesh",
							"gujarat",
							"karnataka",
							"bihar",
							"west-bengal",
							"tamil-nadu",
							"andhra-pradesh",
							"telangana",
						],
						14,
						[
							"punjab",
							"haryana",
							"odisha",
							"jharkhand",
							"chhattisgarh",
							"kerala",
							"jammu-and-kashmir",
							"ladakh",
							"uttarakhand",
							"himachal-pradesh",
							"assam",
							"arunachal-pradesh",
						],
						12,
						[
							"delhi",
							"chandigarh",
							"goa",
							"sikkim",
							"puducherry",
							"lakshadweep",
							"andaman-and-nicobar-islands",
							"meghalaya",
						],
						10,
						9,
					],
					"text-offset": [
						"match",
						["get", "id"],
						"bihar",
						["literal", [0, -0.4]],
						"jharkhand",
						["literal", [0, 0.4]],
						"goa",
						["literal", [-0.8, 0]],
						"puducherry",
						["literal", [0.8, 0]],
						"chandigarh",
						["literal", [0.8, -0.6]],
						"dadra-and-nagar-haveli-and-daman-and-diu",
						["literal", [-1.2, 0]],
						"lakshadweep",
						["literal", [-1.0, 0]],
						["literal", [0, 0]],
					],
					"text-anchor": [
						"match",
						["get", "id"],
						"goa",
						"right",
						"puducherry",
						"left",
						"chandigarh",
						"bottom-left",
						"bihar",
						"bottom",
						"jharkhand",
						"top",
						"center",
					],
				},
				paint: {
					"text-color": "rgba(255,255,255,0.96)",
					"text-halo-color": "rgba(0,0,0,0.45)",
					"text-halo-width": 1.0,
					"text-opacity": 1.0,
				},
			})

			onReady?.()
		})()

		return () => {
			cancelled = true
		}
	}, [map, onReady])

	return null
}
