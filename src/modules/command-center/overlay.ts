import type { Map as MaplibreMap } from "maplibre-gl";
import type { FeatureCollection } from "geojson";
import { CommandCenterService } from "./command-center.service";
import { addLayer, addSource } from "@/shared";

export function addCommandCenterOverlay(map: MaplibreMap) {
  addSource(map, "command-center", CommandCenterService.getCenter() as FeatureCollection);

  addLayer(map, {
    id: "command-halo-cool",
    type: "circle",
    source: "command-center",
    paint: {
      "circle-radius": 92,
      "circle-color": "#3aa0e0",
      "circle-opacity": 0.06,
      "circle-blur": 1.2,
    },
  });

  addLayer(map, {
    id: "command-pulse-outer",
    type: "circle",
    source: "command-center",
    paint: {
      "circle-radius": 56,
      "circle-color": "#ff3b2f",
      "circle-opacity": 0.08,
      "circle-blur": 0.9,
    },
  });

  addLayer(map, {
    id: "command-pulse",
    type: "circle",
    source: "command-center",
    paint: {
      "circle-radius": 30,
      "circle-color": "#ff3b2f",
      "circle-opacity": 0.18,
      "circle-blur": 0.5,
    },
  });

  addLayer(map, {
    id: "command-ring",
    type: "circle",
    source: "command-center",
    paint: {
      "circle-radius": 16,
      "circle-color": "#ff3b2f",
      "circle-opacity": 0.04,
      "circle-stroke-color": "#ff7a64",
      "circle-stroke-width": 1.6,
      "circle-stroke-opacity": 0.7,
    },
  });

  addLayer(map, {
    id: "command-core",
    type: "circle",
    source: "command-center",
    paint: {
      "circle-radius": 5,
      "circle-color": "#ff5a44",
      "circle-stroke-color": "#ffd7ce",
      "circle-stroke-width": 2,
      "circle-stroke-opacity": 0.95,
    },
  });
}
