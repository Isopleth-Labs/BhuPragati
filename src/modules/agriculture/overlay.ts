import type { Map } from "maplibre-gl";
import type { FeatureCollection } from "geojson";
import { AgricultureService } from "./agriculture.service";
import { addLayer, addSource } from "@/shared";

export function addAgricultureOverlay(map: Map) {
  addSource(map, "agriculture-belts", AgricultureService.getData() as FeatureCollection);

  addLayer(map, {
    id: "agriculture-belts-fill",
    type: "fill",
    source: "agriculture-belts",
    paint: {
      "fill-color": "#3cff8f",
      "fill-opacity": [
        "interpolate",
        ["linear"],
        ["get", "intensity"],
        80,
        0.055,
        100,
        0.14,
      ],
    },
  });

  addLayer(map, {
    id: "agriculture-belts-outline",
    type: "line",
    source: "agriculture-belts",
    paint: {
      "line-color": "#a9ffc9",
      "line-width": 1.8,
      "line-opacity": 0.38,
      "line-dasharray": [2.4, 1.2],
    },
  });
}
