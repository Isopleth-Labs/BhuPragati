import type { MapLibreMap } from "maplibre-gl"
import { softenIntelligenceLayers } from "../overlays/intelligence"

/**
 * Plugin factory that gates execution based on readiness.
 *
 * This avoids React lifecycle coupling and keeps the plugin system
 * fully declarative.
 */
export function intelligenceSoftenPlugin(ready: boolean) {
	return (map: MapLibreMap) => {
		if (!ready) return

		softenIntelligenceLayers(map)

		// no event listeners → no cleanup required
		return () => {
			// reserved for future cleanup if softening becomes reversible
		}
	}
}
