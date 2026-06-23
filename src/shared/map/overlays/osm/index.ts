import type { Map as MaplibreMap } from "maplibre-gl"
import { fetchOverpassGeoJson } from "@/shared/lib/dataAdapters/overpass"
import { addPlaceLayers } from "./places"
import { addRoadLayers } from "./roads"
import { addOsmSources } from "./sources"

const BBOX = [25.55, 85.85, 26.2, 86.65] // [S, W, N, E]

const QUERY = `
[out:json][timeout:30];
(
  way["highway"~"^(motorway|trunk|primary|secondary|tertiary|unclassified|residential)$"](${BBOX.join(",")});
  node["place"~"^(city|town|village|hamlet|suburb)$"](${BBOX.join(",")});
);
out tags geom;
`.trim()

export async function addOsmOverlays(map: MaplibreMap) {
	const data = await fetchOverpassGeoJson(QUERY, {
		cacheKey: "kusheshwar.osm.v1",
	})
	if (!data || (!data.roads.features.length && !data.places.features.length)) {
		console.warn("[osm] no data available — skipping OSM overlay")
		return
	}

	const sourcesAdded = addOsmSources(map, data)
	if (!sourcesAdded) return

	try {
		addRoadLayers(map)
		addPlaceLayers(map)
	} catch (err) {
		console.warn("[osm] failed to add layers:", err)
	}
}
