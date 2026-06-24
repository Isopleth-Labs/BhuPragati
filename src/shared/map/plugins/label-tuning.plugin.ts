import type { MapLibreMap } from "maplibre-gl"
import { applyTacticalSky, tuneMapLabels } from "../overlays/labels"

export function labelTuningPlugin(map: MapLibreMap) {
	if (!map) return

	applyTacticalSky(map)
	tuneMapLabels(map)

	return () => {}
}
