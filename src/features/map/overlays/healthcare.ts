import type { Map } from "maplibre-gl";
import type { FeatureCollection, Geometry } from "geojson";
import { healthcareData } from "../../../data/geojson";
import { addLayer, addSource } from "../utils";

export function addHealthcareOverlay(map: Map) {
  addSource(map, "healthcare-access", healthcareData as FeatureCollection<Geometry>);

  addLayer(map, {
    id: "healthcare-access-halos",
    type: "circle",
    source: "healthcare-access",
    paint: {
      "circle-radius": [
        "interpolate",
        ["linear"],
        ["get", "capacity"],
        40,
        24,
        70,
        38,
      ],
      "circle-color": "#3c8cff",
      "circle-opacity": 0.095,
      "circle-blur": 0.48,
    },
  });

  addLayer(map, {
    id: "healthcare-access-points",
    type: "circle",
    source: "healthcare-access",
    paint: {
      "circle-radius": 8,
      "circle-color": "#3c8cff",
      "circle-opacity": 0.75,
      "circle-stroke-color": "#d9e8ff",
      "circle-stroke-width": 1.7,
    },
  });
}
