// Post-load softener for the heavy infrastructure overlays.
// Goal: convert hard GIS polygons into "intelligence sectors":
//   - lower fill opacity
//   - blurred outlines (signal-field feel)
//   - extended glow rings
// All mutations are no-ops if the layer is missing, so this is safe to
// call right after lazy overlay load.
import type { Map as MaplibreMap } from "maplibre-gl";

const safe = (fn: () => void) => {
	try {
		fn();
	} catch {
		/* missing layer / property */
	}
};

// Generic line-glow softening: wider, blurrier, lower opacity.
function softenGlow(
	map: MaplibreMap,
	id: string,
	width: number,
	blur: number,
	opacity: number,
) {
	safe(() => map.setPaintProperty(id, "line-width", width));
	safe(() => map.setPaintProperty(id, "line-blur", blur));
	safe(() => map.setPaintProperty(id, "line-opacity", opacity));
}

// Generic outline softening: kept thin but blurred.
function softenOutline(map: MaplibreMap, id: string, opacity = 0.28) {
	safe(() => map.setPaintProperty(id, "line-blur", 1.4));
	safe(() => map.setPaintProperty(id, "line-opacity", opacity));
}

export function softenIntelligenceLayers(map: MaplibreMap) {
	// Flood — wetland reconnaissance sectors
	softenGlow(map, "flood-risk-glow", 18, 18, 0.18);
	softenOutline(map, "flood-risk-outline", 0.3);
	safe(() => map.setPaintProperty("flood-wetland-points", "circle-blur", 0.35));
	safe(() =>
		map.setPaintProperty("flood-wetland-points", "circle-stroke-opacity", 0.6),
	);

	// Roads — last-mile signal corridors
	softenGlow(map, "road-corridor-glow", 12, 14, 0.22);
	safe(() => map.setPaintProperty("road-corridors", "line-blur", 0.8));
	safe(() => map.setPaintProperty("road-corridors", "line-opacity", 0.78));
	safe(() => map.setPaintProperty("road-critical-nodes", "circle-blur", 0.4));

	// Healthcare — access influence fields
	safe(() =>
		map.setPaintProperty("healthcare-access-halos", "circle-blur", 1.2),
	);
	safe(() =>
		map.setPaintProperty("healthcare-access-halos", "circle-opacity", 0.18),
	);
	safe(() =>
		map.setPaintProperty("healthcare-access-points", "circle-blur", 0.3),
	);

	// Agriculture — dependency heat regions
	safe(() =>
		map.setPaintProperty("agriculture-belts-fill", "fill-opacity", 0.13),
	);
	softenOutline(map, "agriculture-belts-outline", 0.26);

	// Electricity — feeder stress fields
	softenGlow(map, "electricity-feeder-glow", 11, 13, 0.22);
	safe(() => map.setPaintProperty("electricity-feeders", "line-blur", 0.7));
	safe(() => map.setPaintProperty("electricity-feeders", "line-opacity", 0.8));
	safe(() => map.setPaintProperty("electricity-assets", "circle-blur", 0.4));
}
