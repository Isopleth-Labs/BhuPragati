import type { Map as MaplibreMap } from "maplibre-gl"
import { addLayer, addSource } from "@/shared"
import { AnalysisGridService } from "./analysis-grid.service"

export function addAnalysisGridOverlay(map: MaplibreMap) {
	addSource(map, "analysis-grid", AnalysisGridService.getGrid())

	addLayer(map, {
		id: "analysis-grid-glow",
		type: "line",
		source: "analysis-grid",
		paint: {
			"line-color": "#1ba6ff",
			"line-width": 10,
			"line-opacity": 0.075,
			"line-blur": 7,
		},
	})

	addLayer(map, {
		id: "analysis-grid-line",
		type: "line",
		source: "analysis-grid",
		paint: {
			"line-color": "#65d2ff",
			"line-width": 1,
			"line-opacity": 0.14,
			"line-dasharray": [1.5, 2.4],
		},
	})
}
