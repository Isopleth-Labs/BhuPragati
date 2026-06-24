import type { Map as MaplibreMap } from "maplibre-gl"

export function addOsmSources(
	map: MaplibreMap,
	data: {
		roads: GeoJSON.FeatureCollection
		places: GeoJSON.FeatureCollection
	},
): boolean {
	// Guard: check if map has been destroyed or unmounted during the fetch
	try {
		if (!map?.getStyle()) return false
	} catch {
		return false
	}

	try {
		if (!map.getSource("osm-roads")) {
			map.addSource("osm-roads", { type: "geojson", data: data.roads })
		}
		if (!map.getSource("osm-places")) {
			map.addSource("osm-places", { type: "geojson", data: data.places })
		}
		return true
	} catch (err) {
		console.warn("[osm] failed to add sources:", err)
		return false
	}
}
