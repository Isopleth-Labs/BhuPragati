import type { Map } from "maplibre-gl";
import { analysisGrid } from "../../../data/geojson";
import { addLayer, addSource } from "../utils";

export function addAnalysisGridOverlay(map : Map) {
  addSource(map, "analysis-grid", analysisGrid);

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
  });

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
  });
}
