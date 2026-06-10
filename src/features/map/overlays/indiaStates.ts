import type { Map as MapLibreMap, GeoJSONSource } from "maplibre-gl";
import type { FeatureCollection, Geometry } from "geojson";
import { addLayer, addSource, getFirstSymbolLayerId } from "@/shared";
import { STATE_INDICATORS_DATA } from "../../../data/stateIndicators";

export const INDIA_STATES_SOURCE_ID = "india-states-source";
export const INDIA_STATES_LABEL_SOURCE_ID = "india-states-label-source";
export const INDIA_STATES_FILL_ID = "india-states-fill";
export const INDIA_STATES_OUTLINE_ID = "india-states-outline";
export const INDIA_STATES_LABEL_ID = "india-states-label";

// Export the numeric ID mapping so MapEngine can resolve hovered states for setFeatureState
export const stateIdToNumericId: Record<string, number> = {};




function getMinMaxScores(indicator: string): { min: number; max: number } {
  const scores = Object.values(STATE_INDICATORS_DATA).map(
    (s) => s.metrics[indicator as keyof typeof s.metrics] ?? 60
  );
  return {
    min: Math.min(...scores),
    max: Math.max(...scores),
  };
}

function getLabelFeatures(features: any[]): any[] {
  return features.map((f) => {
    const props = f.properties as any;
    // Read pre-computed visual center and tier from upgraded geojson properties
    const coords = props.label_coordinate || props.centroid || [82.75, 21.0];
    const labelTier = props.label_tier || 3;
    const districtCount = props.district_count || 0;
    const bbox = props.bbox || [];
    
    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [Number(coords[0]), Number(coords[1])],
      },
      properties: {
        id: props.state_id || props.id,
        name_en: props.state_name || props.name_en,
        label_tier: labelTier,
        district_count: districtCount,
        bbox: bbox,
      },
    };
  });
}

export function addIndiaStatesLayers(
  map: MapLibreMap,
  data: FeatureCollection<Geometry>,
  activeIndicator: string = "overall"
): void {
  // Populate stateIdToNumericId and assign top-level feature ids
  data.features.forEach((f, idx) => {
    const numericId = idx + 1;
    f.id = numericId; // MapLibre setFeatureState requires numeric IDs
    const stringId = (f.properties as any)?.id as string | undefined;
    if (stringId) {
      stateIdToNumericId[stringId] = numericId;
    }
  });

  if (!map.getSource(INDIA_STATES_SOURCE_ID)) {
    addSource(map, INDIA_STATES_SOURCE_ID, data);
  }

  // Create point features for single-label rendering
  const labelFeatures = getLabelFeatures(data.features);
  labelFeatures.forEach((f, idx) => {
    f.id = idx + 1; // Align numeric IDs for setFeatureState
  });

  // === LABEL DATA DEBUG (requested by user) ===
  console.log(`[LABEL DATA] Feature count: ${labelFeatures.length} (expected: 36)`);
  console.log(`[LABEL DATA] First 5 features:`, labelFeatures.slice(0, 5));
  
  // Verify each label feature contains required properties
  labelFeatures.slice(0, 5).forEach((f: any, i: number) => {
    const hasNameEn = !!f.properties?.name_en;
    const hasId = !!f.properties?.id;
    const hasCoords = Array.isArray(f.geometry?.coordinates) && f.geometry.coordinates.length === 2;
    console.log(`[LABEL DATA] Feature[${i}]: name_en=${f.properties?.name_en}, id=${f.properties?.id}, coords=[${f.geometry?.coordinates}], valid=${hasNameEn && hasId && hasCoords}`);
  });
  // === END LABEL DATA DEBUG ===

  if (!map.getSource(INDIA_STATES_LABEL_SOURCE_ID)) {
    addSource(map, INDIA_STATES_LABEL_SOURCE_ID, {
      type: "FeatureCollection",
      features: labelFeatures,
    } as any);
    console.log(`[LABEL DATA] Source created: ${INDIA_STATES_LABEL_SOURCE_ID}`);
  } else {
    console.log(`[LABEL DATA] Source already exists: ${INDIA_STATES_LABEL_SOURCE_ID}`);
  }



  // Attach normalized scores as feature-state for linear color stretch
  const { min, max } = getMinMaxScores(activeIndicator);
  console.info(`[Choropleth Debug] Initializing layers. Indicator: ${activeIndicator}, Min: ${min}, Max: ${max}`);

  data.features.forEach((f) => {
    const id = (f.properties as any)?.id as string | undefined;
    if (id && STATE_INDICATORS_DATA[id]) {
      const score = STATE_INDICATORS_DATA[id].metrics[activeIndicator as keyof typeof STATE_INDICATORS_DATA[string]['metrics']] ?? 60;
      const score_norm = max > min ? ((score - min) / (max - min)) * 100 : 50;
      const numericId = stateIdToNumericId[id];
      if (numericId !== undefined) {
        map.setFeatureState({ source: INDIA_STATES_SOURCE_ID, id: numericId }, { score: score_norm });
      }
    }
  });

  const beforeId = getFirstSymbolLayerId(map);
  console.info(`[LABEL DEBUG] beforeId for fill/outline layers: ${beforeId ?? 'undefined (will add on top)'}`);

  if (!map.getLayer(INDIA_STATES_FILL_ID)) {
    addLayer(
      map,
      {
        id: INDIA_STATES_FILL_ID,
        type: "fill",
        source: INDIA_STATES_SOURCE_ID,
        paint: {
          "fill-color": [
            "interpolate",
            ["linear"],
            [
              "coalesce",
              ["feature-state", "score"],
              50
            ],
            0, "#081F5C",
            25, "#0E4DB3",
            50, "#1F8EDB",
            75, "#23B68B",
            100, "#F4A300"
          ],
          "fill-color-transition": {
            "duration": 450
          },
          "fill-opacity": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            0.92,            // Premium visual density on hover
            0.86             // Slightly higher opacity to ensure colors are solid and distinguishable on dark terrain
          ],
          "fill-opacity-transition": {
            "duration": 300
          }
        },
      },
      beforeId,
    );
  }

  // Single premium clean outline border layer
  if (!map.getLayer(INDIA_STATES_OUTLINE_ID)) {
    addLayer(
      map,
      {
        id: INDIA_STATES_OUTLINE_ID,
        type: "line",
        source: INDIA_STATES_SOURCE_ID,
        paint: {
          "line-color": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            "rgba(255, 255, 255, 0.95)", // Hover Border: rgba(255,255,255,0.95)
            "rgba(255, 255, 255, 0.18)"  // Base Border: rgba(255,255,255,0.18)
          ],
          "line-width": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            2.0,                         // Hover Border width: 2.0px
            0.8                          // Base Border width: 0.8px
          ],
          "line-opacity": 1.0,
          "line-color-transition": {
            "duration": 250
          },
          "line-width-transition": {
            "duration": 250
          },
          "line-opacity-transition": {
            "duration": 250
          }
        },
      },
      beforeId,
    );
  }

  if (!map.getLayer(INDIA_STATES_LABEL_ID)) {
    map.addLayer({
      id: INDIA_STATES_LABEL_ID,
      type: "symbol",
      source: INDIA_STATES_LABEL_SOURCE_ID,
      layout: {
        "text-field": ["get", "name_en"],
        "text-font": ["Montserrat SemiBold", "Montserrat Medium", "Open Sans Regular"],
        "text-letter-spacing": 0.05,
        "text-max-width": [
          "match",
          ["get", "id"],
          // Large states can afford wider labels
          "rajasthan", 10,
          "maharashtra", 8,
          "uttar-pradesh", 8,
          "madhya-pradesh", 8,
          "gujarat", 8,
          "karnataka", 8,
          "tamil-nadu", 8,
          "andhra-pradesh", 8,
          "telangana", 8,
          // Small/UT states need tight wrapping
          "dadra-and-nagar-haveli-and-daman-and-diu", 5,
          "andaman-and-nicobar-islands", 5,
          "lakshadweep", 5,
          // Default
          7
        ],
        "text-size": [
          "match",
          ["get", "id"],
          // Large States: 14px
          "rajasthan", 14,
          "maharashtra", 14,
          "uttar-pradesh", 14,
          "madhya-pradesh", 14,
          "gujarat", 14,
          "karnataka", 14,
          "bihar", 14,
          "west-bengal", 14,
          "tamil-nadu", 14,
          "andhra-pradesh", 14,
          "telangana", 14,

          // Medium States: 12px
          "punjab", 12,
          "haryana", 12,
          "odisha", 12,
          "jharkhand", 12,
          "chhattisgarh", 12,
          "kerala", 12,
          "jammu-and-kashmir", 12,
          "ladakh", 12,
          "uttarakhand", 12,
          "himachal-pradesh", 12,

          // Small States (including NE states): 10px
          "delhi", 10,
          "chandigarh", 10,
          "goa", 10,
          "sikkim", 10,
          "dadra-and-nagar-haveli-and-daman-and-diu", 9,
          "puducherry", 10,
          "lakshadweep", 10,
          "andaman-and-nicobar-islands", 10,
          // NE states: hierarchical sizing to reduce overlap
          "assam", 12,
          "arunachal-pradesh", 12,
          "meghalaya", 10,
          "nagaland", 9,
          "manipur", 9,
          "mizoram", 9,
          "tripura", 9,

          // default size fallback
          10
        ],
        "text-allow-overlap": true,
        "text-ignore-placement": true,
        "text-padding": 2,
        "text-offset": [
          "match",
          ["get", "id"],
          // Tiny UTs: anchor label just outside polygon for readability
          "goa", ["literal", [-0.8, 0]],
          "puducherry", ["literal", [0.8, 0]],
          "chandigarh", ["literal", [0.8, -0.6]],
          // Crowded north-central pair: push apart vertically
          "bihar", ["literal", [0, -0.4]],
          "jharkhand", ["literal", [0, 0.4]],
          // Small western UT
          "dadra-and-nagar-haveli-and-daman-and-diu", ["literal", [-1.2, 0]],
          "lakshadweep", ["literal", [-1.0, 0]],
          // Default: no offset
          ["literal", [0, 0]]
        ],
        "text-anchor": [
          "match",
          ["get", "id"],
          // Specific Placement Anchors
          "goa", "right",
          "puducherry", "left",
          "chandigarh", "bottom-left",
          "bihar", "bottom",
          "jharkhand", "top",
          "dadra-and-nagar-haveli-and-daman-and-diu", "right",
          "lakshadweep", "right",
          "center"
        ]
      },
      paint: {
        "text-color": "rgba(255, 255, 255, 0.96)",
        "text-halo-color": "rgba(0, 0, 0, 0.45)",
        "text-halo-width": 1.0,
        "text-halo-blur": 0,
        "text-opacity": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          0.75, // Hovered state: 0.6 to 0.8 (we use 0.75)
          1.0   // Normal state: 1.0
        ]
      },
    } as any);
    console.log(`[LABEL DIAG] Layer created: ${INDIA_STATES_LABEL_ID}`);
  } else {
    console.log(`[LABEL DIAG] Layer already existed: ${INDIA_STATES_LABEL_ID}`);
  }

  // === POST-CREATION VERIFICATION ===
  const layerExists = !!map.getLayer(INDIA_STATES_LABEL_ID);
  const sourceExists = !!map.getSource(INDIA_STATES_LABEL_SOURCE_ID);
  console.log(`[LABEL DIAG] Layer exists: ${layerExists}`);
  console.log(`[LABEL DIAG] Source exists: ${sourceExists}`);

  if (layerExists) {
    const vis = map.getLayoutProperty(INDIA_STATES_LABEL_ID, "visibility");
    const tf = map.getLayoutProperty(INDIA_STATES_LABEL_ID, "text-field");
    const ts = map.getLayoutProperty(INDIA_STATES_LABEL_ID, "text-size");
    const overlap = map.getLayoutProperty(INDIA_STATES_LABEL_ID, "text-allow-overlap");
    console.log(`[LABEL DIAG] visibility: ${vis ?? "visible (default)"}`);
    console.log(`[LABEL DIAG] text-field: ${JSON.stringify(tf)}`);
    console.log(`[LABEL DIAG] text-size: ${JSON.stringify(ts)}`);
    console.log(`[LABEL DIAG] text-allow-overlap: ${overlap}`);
  }

  // Layer order check
  const allLayerIds = map.getStyle().layers?.map((l: any) => l.id) ?? [];
  const labelIdx = allLayerIds.indexOf(INDIA_STATES_LABEL_ID);
  const fillIdx = allLayerIds.indexOf(INDIA_STATES_FILL_ID);
  console.log(`[LABEL DIAG] Total layers: ${allLayerIds.length}`);
  console.log(`[LABEL DIAG] Fill layer index: ${fillIdx}`);
  console.log(`[LABEL DIAG] Label layer index: ${labelIdx}`);
  console.log(`[LABEL DIAG] Label is ${labelIdx > fillIdx ? "ABOVE" : "BELOW"} fill`);
  console.log(`[LABEL DIAG] Last 5 layers:`, allLayerIds.slice(-5));
  console.info(`[LABEL DEBUG] Label is ${labelIdx > fillIdx ? 'ABOVE' : 'BELOW'} fill layer`);
}

export function updateChoroplethIndicator(map: MapLibreMap, indicator: string): void {
  const { min, max } = getMinMaxScores(indicator);
  console.info(`[Choropleth Debug Pass] Indicator switched to: ${indicator.toUpperCase()}`);
  console.info(`[Choropleth Debug Pass] Data bounds: Min: ${min}, Max: ${max}`);
  console.info(`[Choropleth Debug Pass] Stop values: 0->Very Low (#081F5C), 25->Low (#0E4DB3), 50->Medium (#1F8EDB), 75->High (#23B68B), 100->Very High (#F4A300)`);

  let count = 0;
  Object.keys(STATE_INDICATORS_DATA).forEach((id) => {
    const numericId = stateIdToNumericId[id];
    if (numericId !== undefined) {
      const score = STATE_INDICATORS_DATA[id].metrics[indicator as keyof typeof STATE_INDICATORS_DATA[string]['metrics']] ?? 60;
      const score_norm = max > min ? ((score - min) / (max - min)) * 100 : 50;
      map.setFeatureState({ source: INDIA_STATES_SOURCE_ID, id: numericId }, { score: score_norm });
      
      if (count < 3) {
        console.log(`[Choropleth Debug Pass] State stateId=${id} (numericId=${numericId}): actual score=${score.toFixed(1)} -> normalized score=${score_norm.toFixed(1)}`);
        count++;
      }
    }
  });

  if (map.getLayer(INDIA_STATES_FILL_ID)) {
    const paintColor = map.getPaintProperty(INDIA_STATES_FILL_ID, "fill-color");
    console.info(`[Choropleth Debug Pass] Verified layer paint fill-color expression:`, JSON.stringify(paintColor));
  }
}

export function setIndiaStatesData(map: MapLibreMap, data: FeatureCollection<Geometry>): void {
  data.features.forEach((f, idx) => {
    const numericId = idx + 1;
    f.id = numericId;
    const stringId = (f.properties as any)?.id as string | undefined;
    if (stringId) {
      stateIdToNumericId[stringId] = numericId;
    }
  });

  const source = map.getSource(INDIA_STATES_SOURCE_ID) as GeoJSONSource | undefined;
  if (source) {
    source.setData(data as any);
  }
  const labelSource = map.getSource(INDIA_STATES_LABEL_SOURCE_ID) as GeoJSONSource | undefined;
  if (labelSource) {
    const labelFeatures = getLabelFeatures(data.features);
    labelFeatures.forEach((f, idx) => {
      f.id = idx + 1; // Align numeric IDs for setFeatureState
    });
    labelSource.setData({
      type: "FeatureCollection",
      features: labelFeatures,
    } as any);
  }

}

export function filterSelectedState(map: MapLibreMap, selectedId: string | null): void {
  // Keep base states, borders, and labels visible at all times so that the user
  // can see them in context, hover over them, or click another state to update selection.
  console.log("[states] selected state filter update:", selectedId);
  if (map.getLayer(INDIA_STATES_FILL_ID)) {
    map.setLayoutProperty(INDIA_STATES_FILL_ID, "visibility", "visible");
  }
  if (map.getLayer(INDIA_STATES_OUTLINE_ID)) {
    map.setLayoutProperty(INDIA_STATES_OUTLINE_ID, "visibility", "visible");
  }
  if (map.getLayer(INDIA_STATES_LABEL_ID)) {
    map.setLayoutProperty(INDIA_STATES_LABEL_ID, "visibility", "visible");
  }
}
