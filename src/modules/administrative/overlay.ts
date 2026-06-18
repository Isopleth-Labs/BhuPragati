import type { Map as MaplibreMap } from "maplibre-gl";
import { addLayer, addSource } from "#/shared/lib/utils/utils";
import { AdministrativeService } from "./administrative.service";

export function addAdministrativeOverlay(map: MaplibreMap) {
	addSource(
		map,
		"administrative-boundaries",
		AdministrativeService.getBoundaries(),
	);

	// District line moved to DistrictBoundaryLayer (BoundaryProvider-backed).
	const focusFilter = ["==", ["get", "boundaryType"], "focus"];

	addLayer(map, {
		id: "kusheshwar-focus-aura",
		type: "line",
		source: "administrative-boundaries",
		filter: focusFilter,
		paint: {
			"line-color": "#ff2a1f",
			"line-width": 50,
			"line-opacity": 0.08,
			"line-blur": 38,
		},
	});

	addLayer(map, {
		id: "kusheshwar-focus-bloom",
		type: "line",
		source: "administrative-boundaries",
		filter: focusFilter,
		paint: {
			"line-color": "#ff3b2f",
			"line-width": 28,
			"line-opacity": 0.18,
			"line-blur": 22,
		},
	});

	addLayer(map, {
		id: "kusheshwar-focus-glow",
		type: "line",
		source: "administrative-boundaries",
		filter: focusFilter,
		paint: {
			"line-color": "#ff4a3a",
			"line-width": 12,
			"line-opacity": 0.4,
			"line-blur": 9,
		},
	});

	addLayer(map, {
		id: "kusheshwar-focus-core",
		type: "line",
		source: "administrative-boundaries",
		filter: focusFilter,
		paint: {
			"line-color": "#ff6450",
			"line-width": 2.6,
			"line-opacity": 0.98,
		},
	});
}
