import type { Map } from "maplibre-gl";
import type { FeatureCollection, Geometry, GeoJsonProperties } from "geojson";
import { administrativeBoundaries } from "../../data/geojson";
import { addLayer, addSource } from "@/shared";

export function addAdministrativeOverlay(map:Map) {
  addSource(
    map,
    "administrative-boundaries",
    administrativeBoundaries as FeatureCollection<Geometry, GeoJsonProperties>,
  );

  const focusFilter = ["==", ["get", "boundaryType"], "focus"];
  const districtFilter = ["==", ["get", "boundaryType"], "district"];

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
