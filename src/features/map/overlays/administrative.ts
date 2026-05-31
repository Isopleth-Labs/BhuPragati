import type { Map } from "maplibre-gl";
import { administrativeBoundaries } from "../../../data/geojson";
import { addLayer, addSource } from "../utils";

// Restrained district + focus outline:
// - faint district line for context
// - soft red glow around the priority focus zone
// - sharp red core line for hero emphasis

export function addAdministrativeOverlay(map:Map) {
  addSource(map, "administrative-boundaries", administrativeBoundaries);

  const focusFilter = ["==", ["get", "boundaryType"], "focus"];
  const districtFilter = ["==", ["get", "boundaryType"], "district"];

  // District outline (subtle reference frame).
  addLayer(map, {
    id: "darbhanga-district-line",
    type: "line",
    source: "administrative-boundaries",
    filter: districtFilter,
    paint: {
      "line-color": "#5fa8d8",
      "line-width": 1,
      "line-opacity": 0.22,
    },
  });

  // Focus zone wide danger aura — soft outermost halo for cinematic depth.
  addLayer(map, {
    id: "kusheshwar-focus-aura",
    type: "line",
    source: "administrative-boundaries",
    filter: focusFilter,
    paint: {
      "line-color": "#ff2a1f",
      "line-width": 50,
      "line-opacity": 0.08,
      "line-blur": 38,
    },
  });

  // Focus zone outer bloom (cinematic halo, animated subtly).
  addLayer(map, {
    id: "kusheshwar-focus-bloom",
    type: "line",
    source: "administrative-boundaries",
    filter: focusFilter,
    paint: {
      "line-color": "#ff3b2f",
      "line-width": 28,
      "line-opacity": 0.18,
      "line-blur": 22,
    },
  });

  // Focus zone mid glow.
  addLayer(map, {
    id: "kusheshwar-focus-glow",
    type: "line",
    source: "administrative-boundaries",
    filter: focusFilter,
    paint: {
      "line-color": "#ff4a3a",
      "line-width": 12,
      "line-opacity": 0.4,
      "line-blur": 9,
    },
  });

  // Focus zone core stroke.
  addLayer(map, {
    id: "kusheshwar-focus-core",
    type: "line",
    source: "administrative-boundaries",
    filter: focusFilter,
    paint: {
      "line-color": "#ff6450",
      "line-width": 2.6,
      "line-opacity": 0.98,
    },
  });
}
