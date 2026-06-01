import type { Map } from "maplibre-gl";
import { electricityData } from "../../data/geojson";
import { addLayer, addSource } from "@/shared";
import type { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";

export function addElectricityOverlay(map: Map) {
  addSource(
    map,
    "electricity-network",
    electricityData as FeatureCollection<Geometry, GeoJsonProperties>,
  );

  addLayer(map, {
    id: "electricity-feeder-glow",
    type: "line",
    source: "electricity-network",
    filter: ["==", ["geometry-type"], "LineString"],
    paint: {
      "line-color": "#bf5cff",
      "line-width": 10,
      "line-opacity": 0.16,
      "line-blur": 9,
    },
  });

  addLayer(map, {
    id: "electricity-feeders",
    type: "line",
    source: "electricity-network",
    filter: ["==", ["geometry-type"], "LineString"],
    paint: {
      "line-color": "#bf5cff",
      "line-width": [
        "interpolate",
        ["linear"],
        ["get", "stress"],
        55,
        3,
        80,
        5.5,
      ],
      "line-opacity": 0.72,
    },
  });

  addLayer(map, {
    id: "electricity-assets",
    type: "circle",
    source: "electricity-network",
    filter: ["==", ["geometry-type"], "Point"],
    paint: {
      "circle-radius": 8,
      "circle-color": "#bf5cff",
      "circle-opacity": 0.74,
      "circle-stroke-color": "#f2ddff",
      "circle-stroke-width": 1.7,
    },
  });
}
