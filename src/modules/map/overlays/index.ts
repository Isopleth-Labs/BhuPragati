// Lazy registry for heavy GIS infrastructure overlays.
// Each entry is loaded on demand via dynamic import so the
// initial map bundle stays lightweight, leaving room for
// future WebGL-heavy layers and AI analytics modules.
import type { Map as MaplibreMap } from "maplibre-gl";

export const heavyOverlayLoaders = {
	flood: () => import("@/modules/flood").then((m) => m.addFloodOverlay),
	road: () => import("@/modules/roads").then((m) => m.addRoadOverlay),
	healthcare: () =>
		import("@/modules/healthcare").then((m) => m.addHealthcareOverlay),
	agriculture: () =>
		import("@/modules/agriculture").then((m) => m.addAgricultureOverlay),
	electricity: () =>
		import("@/modules/electricity").then((m) => m.addElectricityOverlay),
};

export async function loadHeavyOverlays(map: MaplibreMap) {
	const entries = Object.entries(heavyOverlayLoaders);
	const adders = await Promise.all(entries.map(([, load]) => load()));
	adders.forEach((add) => {
		add(map);
	});
}
