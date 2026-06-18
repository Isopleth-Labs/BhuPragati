import type { FeatureCollection, Geometry } from "geojson"
import type { Map as MaplibreMap } from "maplibre-gl"
import { addLayer, addSource } from "@/shared"
import { HealthcareService } from "./healthcare.service"

export function addHealthcareOverlay(map: MaplibreMap) {
	addSource(
		map,
		"healthcare-access",
		HealthcareService.getData() as FeatureCollection<Geometry>,
	)

	addLayer(map, {
		id: "healthcare-access-halos",
		type: "circle",
		source: "healthcare-access",
		paint: {
			"circle-radius": [
				"interpolate",
				["linear"],
				["get", "capacity"],
				40,
				24,
				70,
				38,
			],
			"circle-color": "#3c8cff",
			"circle-opacity": 0.095,
			"circle-blur": 0.48,
		},
	})

	addLayer(map, {
		id: "healthcare-access-points",
		type: "circle",
		source: "healthcare-access",
		paint: {
			"circle-radius": 8,
			"circle-color": "#3c8cff",
			"circle-opacity": 0.75,
			"circle-stroke-color": "#d9e8ff",
			"circle-stroke-width": 1.7,
		},
	})
}
