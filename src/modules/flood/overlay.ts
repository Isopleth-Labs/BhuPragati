import type { Map as MaplibreMap } from "maplibre-gl";
import { FloodService } from "./flood.service";
import { addLayer, addSource } from "@/shared";

export function addFloodOverlay(map: MaplibreMap) {
	addSource(map, "flood-risk", FloodService.getRiskData());

	const polygonFilter = ["==", ["geometry-type"], "Polygon"];
	const pointFilter = ["==", ["geometry-type"], "Point"];

	addLayer(map, {
		id: "flood-risk-glow",
		type: "line",
		source: "flood-risk",
		filter: polygonFilter,
		paint: {
			"line-color": "#ff4438",
			"line-width": 10,
			"line-blur": 11,
			"line-opacity": 0.15,
		},
	});

	addLayer(map, {
		id: "flood-risk-fill",
		type: "fill",
		source: "flood-risk",
		filter: polygonFilter,
		paint: {
			"fill-color": "#ff4438",
			"fill-opacity": [
				"interpolate",
				["linear"],
				["get", "intensity"],
				70,
				0.055,
				95,
				0.14,
			],
		},
	});

	addLayer(map, {
		id: "flood-risk-outline",
		type: "line",
		source: "flood-risk",
		filter: polygonFilter,
		paint: {
			"line-color": "#ff9b8f",
			"line-width": 1.2,
			"line-opacity": 0.42,
		},
	});

	addLayer(map, {
		id: "flood-wetland-points",
		type: "circle",
		source: "flood-risk",
		filter: pointFilter,
		paint: {
			"circle-radius": [
				"interpolate",
				["linear"],
				["get", "areaHa"],
				0,
				5,
				500,
				17,
			],
			"circle-color": "#ff4438",
			"circle-opacity": 0.5,
			"circle-stroke-color": "#ffd6cf",
			"circle-stroke-width": 1.6,
			"circle-stroke-opacity": 0.9,
		},
	});
}
