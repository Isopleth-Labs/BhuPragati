// Tactical label tuning for the carto dark-matter basemap.
// Re-styles existing symbol layers post-load to add:
//  - clean hierarchy (city > town > village)
//  - crisp dark halos for legibility on dark terrain
//  - dimmed road / water labels so cities dominate
// Stealth aesthetic preserved: soft whites, no over-brightening.

import type { Map } from "maplibre-gl";

const HALO_SOFT = "rgba(4, 10, 18, 0.78)";

const safeSet = (fn: () => void) => {
  try {
    fn();
  } catch {
    /* layer may not support this property */
  }
};

function tuneRoadLayer(map: Map, id: string) {
  safeSet(() => map.setPaintProperty(id, "text-color", "rgba(170, 188, 210, 0.5)"));
  safeSet(() => map.setPaintProperty(id, "text-halo-color", HALO_SOFT));
  safeSet(() => map.setPaintProperty(id, "text-halo-width", 1));
  safeSet(() => map.setPaintProperty(id, "text-halo-blur", 0.8));
}

function tuneWaterLabel(map: Map, id: string) {
  safeSet(() => map.setPaintProperty(id, "text-color", "rgba(150, 205, 240, 0.78)"));
  safeSet(() => map.setPaintProperty(id, "text-halo-color", "rgba(2, 8, 16, 0.88)"));
  safeSet(() => map.setPaintProperty(id, "text-halo-width", 1));
  safeSet(() => map.setLayoutProperty(id, "text-letter-spacing", 0.05));
}

// Brighten water fills / river lines so they read like reflective silver-blue.
function tuneWaterFill(map: Map, id: string) {
  safeSet(() => map.setPaintProperty(id, "fill-color", "#0d2840"));
  safeSet(() => map.setPaintProperty(id, "fill-opacity", 0.95));
  safeSet(() =>
    map.setPaintProperty(id, "fill-outline-color", "rgba(120, 180, 220, 0.35)"),
  );
}

function tuneWaterLine(map: Map, id: string) {
  safeSet(() => map.setPaintProperty(id, "line-color", "rgba(180, 220, 244, 0.92)"));
  safeSet(() =>
    map.setPaintProperty(id, "line-width", [
      "interpolate",
      ["linear"],
      ["zoom"],
      8, 0.6,
      11, 1.4,
      14, 2.8,
    ]),
  );
  safeSet(() => map.setPaintProperty(id, "line-blur", 0.3));
  safeSet(() => map.setPaintProperty(id, "line-opacity", 1));
}

export function tuneMapLabels(map: Map) {
  const style = map.getStyle();
  if (!style?.layers) return;

  for (const layer of style.layers) {
    const id = layer.id;
    const type = layer.type;

    if (type === "symbol") {
      // Hide base map place labels so only custom state labels render
      if (/place_country|place_state|place_city|place_capital|place_town|place_village|place_hamlet|place_suburb|place_neighbour|place_other|place_continent/i.test(id)) {
        safeSet(() => map.setLayoutProperty(id, "visibility", "none"));
      } else if (/water|river|ocean|lake|sea/i.test(id)) {
        tuneWaterLabel(map, id);
      } else if (/road|highway|street|transport/i.test(id)) {
        tuneRoadLayer(map, id);
      }
    } else if (type === "fill" && /water|river|lake|ocean/i.test(id)) {
      tuneWaterFill(map, id);
    } else if (type === "line") {
      if (/water|river|stream|waterway|canal/i.test(id)) {
        tuneWaterLine(map, id);
      } else if (/boundary|admin/i.test(id)) {
        safeSet(() => map.setLayoutProperty(id, "visibility", "none"));
      }
    }
  }
}

// Cinematic sky / atmosphere — MapLibre 3+ setSky.
// Wrapped in try/catch for older versions / unsupported renderers.
export function applyTacticalSky(map: Map) {
  try {
    map.setSky?.({
      "sky-color": "#06121f",
      "sky-horizon-blend": 0.55,
      "horizon-color": "#1a3a5c",
      "horizon-fog-blend": 0.85,
      "fog-color": "#02060c",
      "fog-ground-blend": 0.5,
      "atmosphere-blend": [
        "interpolate",
        ["linear"],
        ["zoom"],
        0, 1,
        12, 0.5,
        16, 0,
      ],
    });
  } catch {
    /* setSky unsupported — CSS atmosphere covers gracefully */
  }
}
