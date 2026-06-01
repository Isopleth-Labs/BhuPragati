import type { GeoJSON } from "geojson";
import type { Map } from "maplibre-gl";
import { roadData } from "../../../data/geojson";
import { addLayer, addSource } from "../utils";

export function addRoadOverlay(map: Map) {
  addSource(map, "road-network", roadData as GeoJSON);

  addLayer(map, {
    id: "road-corridor-glow",
    type: "line",
    source: "road-network",
    filter: ["==", ["geometry-type"], "LineString"],
    paint: {
      "line-color": "#ffb020",
      "line-width": 10,
      "line-opacity": 0.12,
      "line-blur": 8,
    },
  });

  addLayer(map, {
    id: "road-corridors",
    type: "line",
    source: "road-network",
    filter: ["==", ["geometry-type"], "LineString"],
    paint: {
      "line-color": "#ffb020",
      "line-width": [
        "interpolate",
        ["linear"],
        ["get", "criticality"],
        60,
        3,
        90,
        6,
      ],
      "line-opacity": 0.76,
      "line-dasharray": [1.5, 0.8],
    },
  });

  addLayer(map, {
    id: "road-critical-nodes",
    type: "circle",
    source: "road-network",
    filter: ["==", ["geometry-type"], "Point"],
    paint: {
      "circle-radius": 8,
      "circle-color": "#ffb020",
      "circle-opacity": 0.72,
      "circle-stroke-color": "#fff3d1",
      "circle-stroke-width": 1.6,
    },
  });
}
