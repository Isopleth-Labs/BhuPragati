import type { Map } from "maplibre-gl";
import type { FeatureCollection } from "geojson";
import { commandCenter } from "../../../data/geojson";
import { addLayer, addSource } from "../utils";

// Compact command marker: outer pulse + ring + bright core.

export function addCommandCenterOverlay(map: Map) {
  addSource(map, "command-center", commandCenter as FeatureCollection);

  // Outer cool tactical halo (blue) — blends with red core for AAA contrast.
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
