import type { Map as MapLibreMap, GeoJSONSource } from "maplibre-gl";
import type { FeatureCollection, Geometry } from "geojson";
import { addLayer, addSource, getFirstSymbolLayerId } from "@/shared";

export const INDIA_STATES_SOURCE_ID = "india-states-source";
export const INDIA_STATES_FILL_ID = "india-states-fill";
export const INDIA_STATES_OUTLINE_ID = "india-states-outline";
export const INDIA_STATES_LABEL_ID = "india-states-label";

const STATE_SCORES: Record<string, number> = {
  kerala: 82,
  "tamil-nadu": 79,
  karnataka: 76,
  maharashtra: 74,
  gujarat: 72,
  telangana: 71,
  punjab: 68,
  "west-bengal": 64,
  bihar: 53,
  jharkhand: 49,
  "andhra-pradesh": 64.3,
  "himachal-pradesh": 62.9,
  haryana: 66.2,
  uttarakhand: 61.5,
  "madhya-pradesh": 55.4,
  rajasthan: 58.2,
  "uttar-pradesh": 52.1,
  assam: 54.2,
  sikkim: 68.1,
  tripura: 62.4,
  meghalaya: 56.8,
  manipur: 55.2,
  nagaland: 53.4,
  "arunachal-pradesh": 51.9,
  mizoram: 63.5,
  goa: 75.2,
  "jammu-and-kashmir": 57.6,
  ladakh: 54.5,
  "andaman-and-nicobar": 61.2,
  lakshadweep: 65.8,
  puducherry: 71.4,
  chandigarh: 77.2,
  delhi: 76.5,
  "dadra-and-nagar-haveli": 64.8,
};

export function addIndiaStatesLayers(map: MapLibreMap, data: FeatureCollection<Geometry>): void {
  if (!map.getSource(INDIA_STATES_SOURCE_ID)) {
    addSource(map, INDIA_STATES_SOURCE_ID, data);
  }

  // Attach scores as feature-state for styling
  data.features.forEach((f) => {
    const id = (f.properties as any)?.id as string | undefined;
    if (id && STATE_SCORES[id]) {
      map.setFeatureState({ source: INDIA_STATES_SOURCE_ID, id }, { score: STATE_SCORES[id] });
    }
  });

  const beforeId = getFirstSymbolLayerId(map);

  if (!map.getLayer(INDIA_STATES_FILL_ID)) {
    addLayer(
      map,
      {
        id: INDIA_STATES_FILL_ID,
        type: "fill",
        source: INDIA_STATES_SOURCE_ID,
        paint: {
          "fill-color": [
            "step",
            [
              "coalesce",
              ["feature-state", "score"],
              ["min", 95, ["+", 55, ["*", ["length", ["get", "id"]], 0.8]]],
            ],
            "#4f46e5", // <50 Low
            50, "#3b82f6", // 50-59 Medium Low
            60, "#22c55e", // 60-69 Medium
            70, "#eab308", // 70-79 Medium High
            80, "#f97316", // 80-89 High
            90, "#a855f7", // 90+ Very High
          ],
          "fill-opacity": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            0.95,
            0.88
          ],
        },
      },
      beforeId,
    );
  }

  if (!map.getLayer(INDIA_STATES_OUTLINE_ID)) {
    addLayer(
      map,
      {
        id: INDIA_STATES_OUTLINE_ID,
        type: "line",
        source: INDIA_STATES_SOURCE_ID,
        paint: {
          "line-color": "#1e293b",
          "line-width": 1.4,
          "line-opacity": 0.55,
        },
      },
      beforeId,
    );
  }

  if (!map.getLayer(INDIA_STATES_LABEL_ID)) {
    addLayer(
      map,
      {
        id: INDIA_STATES_LABEL_ID,
        type: "symbol",
        source: INDIA_STATES_SOURCE_ID,
        layout: {
          "text-field": ["get", "name_en"],
          "text-size": 12,
          "text-transform": "uppercase",
          "text-letter-spacing": 0.1,
        },
        paint: {
          "text-color": "#e5edff",
          "text-halo-color": "#0f172a",
          "text-halo-width": 1.4,
        },
      },
      beforeId,
    );
  }
}

export function setIndiaStatesData(map: MapLibreMap, data: FeatureCollection<Geometry>): void {
  const source = map.getSource(INDIA_STATES_SOURCE_ID) as GeoJSONSource | undefined;
  if (source) {
    source.setData(data as any);
  }
}

export function filterSelectedState(map: MapLibreMap, selectedId: string | null): void {
  const visibility = selectedId ? "none" : "visible";
  if (map.getLayer(INDIA_STATES_FILL_ID)) {
    map.setLayoutProperty(INDIA_STATES_FILL_ID, "visibility", visibility);
    map.setFilter(INDIA_STATES_FILL_ID, null as any);
  }
  if (map.getLayer(INDIA_STATES_OUTLINE_ID)) {
    map.setLayoutProperty(INDIA_STATES_OUTLINE_ID, "visibility", visibility);
  }
  if (map.getLayer(INDIA_STATES_LABEL_ID)) {
    map.setLayoutProperty(INDIA_STATES_LABEL_ID, "visibility", visibility);
  }
}
