// Real OSM geographic data for the Kusheshwar Asthan floodplain region.
// Fetched live from Overpass API, cached in localStorage for 7 days.
// Renders:
//   - road network (motorway / trunk / primary / secondary / tertiary / residential)
//   - settlement labels (city / town / village / hamlet)

import type { Map } from "maplibre-gl";

const BBOX = [25.55, 85.85, 26.2, 86.65]; // [S, W, N, E]

const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.openstreetmap.ru/api/interpreter",
];

const QUERY = `
[out:json][timeout:30];
(
  way["highway"~"^(motorway|trunk|primary|secondary|tertiary|unclassified|residential)$"](${BBOX.join(",")});
  node["place"~"^(city|town|village|hamlet|suburb)$"](${BBOX.join(",")});
);
out tags geom;
`.trim();

const CACHE_KEY = "kusheshwar.osm.v1";
const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 7;

// ---- Cache helpers ---------------------------------------------------

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL_MS) return null;
    return data;
  } catch {
    return null;
  }
}

function writeCache(data: any) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
  } catch {
    /* quota or storage disabled — cache is best-effort */
  }
}

// ---- Overpass fetch + GeoJSON shaping --------------------------------

function osmToGeoJson(osm: any) {
  const roads = { type: "FeatureCollection", features: [] };
  const places = { type: "FeatureCollection", features: [] };

  for (const el of osm.elements || []) {
    if (el.type === "way" && el.geometry && el.tags?.highway) {
      roads.features.push({
        type: "Feature",
        properties: {
          highway: el.tags.highway,
          name: el.tags.name || "",
          ref: el.tags.ref || "",
        },
        geometry: {
          type: "LineString",
          coordinates: el.geometry.map((g) => [g.lon, g.lat]),
        },
      });
    } else if (el.type === "node" && el.tags?.place && el.tags?.name) {
      places.features.push({
        type: "Feature",
        properties: {
          place: el.tags.place,
          name: el.tags.name,
          population: el.tags.population ? Number(el.tags.population) : null,
        },
        geometry: { type: "Point", coordinates: [el.lon, el.lat] },
      });
    }
  }
  return { roads, places };
}

async function fetchOverpass() {
  const cached = readCache();
  if (cached) return cached;

  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        body: "data=" + encodeURIComponent(QUERY),
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      if (!res.ok) continue;
      const json = await res.json();
      const data = osmToGeoJson(json);
      writeCache(data);
      return data;
    } catch (err) {
      // try next endpoint
      console.warn("[osm] endpoint failed:", endpoint, err);
    }
  }
  return null;
}

// ---- Map rendering ---------------------------------------------------

function addRoadLayers(map: Map) {
  // Soft tactical underglow — only meaningful on major routes.
  map.addLayer({
    id: "osm-road-glow",
    type: "line",
    source: "osm-roads",
    layout: { "line-cap": "round", "line-join": "round" },
    filter: [
      "in",
      ["get", "highway"],
      ["literal", ["motorway", "trunk", "primary", "secondary"]],
    ],
    paint: {
      "line-color": "#7cc1f2",
      "line-blur": 5,
      "line-opacity": [
        "match",
        ["get", "highway"],
        "motorway", 0.26,
        "trunk", 0.22,
        "primary", 0.2,
        "secondary", 0.14,
        0.1,
      ],
      "line-width": [
        "interpolate",
        ["linear"],
        ["zoom"],
        9,
        ["match", ["get", "highway"],
          "motorway", 4, "trunk", 3.5, "primary", 3,
          "secondary", 2, "tertiary", 1.4, 0.8],
        13,
        ["match", ["get", "highway"],
          "motorway", 9, "trunk", 8, "primary", 7,
          "secondary", 5, "tertiary", 3.5, 2.2],
        16,
        ["match", ["get", "highway"],
          "motorway", 16, "trunk", 14, "primary", 12,
          "secondary", 9, "tertiary", 6, 4],
      ],
    },
  });

  // Crisp light core.
  map.addLayer({
    id: "osm-road-core",
    type: "line",
    source: "osm-roads",
    layout: { "line-cap": "round", "line-join": "round" },
    paint: {
      "line-color": [
        "match",
        ["get", "highway"],
        "motorway", "rgba(225, 240, 254, 0.94)",
        "trunk", "rgba(215, 232, 250, 0.88)",
        "primary", "rgba(205, 224, 246, 0.78)",
        "secondary", "rgba(180, 205, 230, 0.55)",
        "tertiary", "rgba(155, 180, 208, 0.32)",
        "unclassified", "rgba(140, 165, 195, 0.22)",
        "rgba(135, 160, 188, 0.22)",
      ],
      "line-width": [
        "interpolate",
        ["linear"],
        ["zoom"],
        9,
        ["match", ["get", "highway"],
          "motorway", 1.4, "trunk", 1.2, "primary", 1.0,
          "secondary", 0.7, "tertiary", 0.4, 0.3],
        13,
        ["match", ["get", "highway"],
          "motorway", 3.4, "trunk", 3.0, "primary", 2.6,
          "secondary", 1.9, "tertiary", 1.3, 0.9],
        16,
        ["match", ["get", "highway"],
          "motorway", 6.5, "trunk", 5.6, "primary", 4.8,
          "secondary", 3.6, "tertiary", 2.4, 1.6],
      ],
    },
  });
}

function addPlaceLayers(map: Map) {
  // Marker dots, sized by tier.
  map.addLayer({
    id: "osm-place-dots",
    type: "circle",
    source: "osm-places",
    paint: {
      "circle-radius": [
        "match",
        ["get", "place"],
        "city", 5.4,
        "town", 3.6,
        "village", 2.4,
        "hamlet", 1.6,
        1.4,
      ],
      "circle-color": [
        "match",
        ["get", "place"],
        "city", "#ffffff",
        "town", "#dde7f4",
        "#a8b8cc",
      ],
      "circle-opacity": [
        "match",
        ["get", "place"],
        "city", 0.96,
        "town", 0.86,
        "village", 0.72,
        0.6,
      ],
      "circle-stroke-color": "rgba(120, 180, 220, 0.55)",
      "circle-stroke-width": 1,
    },
  });

  // Labels (collision-aware).
  map.addLayer({
    id: "osm-place-labels",
    type: "symbol",
    source: "osm-places",
    layout: {
      "text-field": ["get", "name"],
      "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
      "text-size": [
        "match",
        ["get", "place"],
        "city", ["interpolate", ["linear"], ["zoom"], 8, 15, 11, 24, 13, 30],
        "town", ["interpolate", ["linear"], ["zoom"], 9, 11, 12, 14, 14, 17],
        "village", ["interpolate", ["linear"], ["zoom"], 11, 9, 13, 11, 15, 13],
        ["interpolate", ["linear"], ["zoom"], 12, 8, 14, 9.5, 16, 11],
      ],
      "text-letter-spacing": [
        "match",
        ["get", "place"],
        "city", 0.06,
        "town", 0.04,
        0.02,
      ],
      "text-offset": [0, 1.2],
      "text-anchor": "top",
      "text-padding": 5,
      "text-allow-overlap": false,
      "symbol-sort-key": [
        "match",
        ["get", "place"],
        "city", 1,
        "town", 2,
        "village", 3,
        4,
      ],
    },
    paint: {
      "text-color": [
        "match",
        ["get", "place"],
        "city", "rgba(255, 255, 255, 0.96)",
        "town", "rgba(225, 235, 250, 0.84)",
        "village", "rgba(190, 205, 225, 0.6)",
        "rgba(170, 185, 205, 0.5)",
      ],
      "text-halo-color": "rgba(4, 10, 18, 0.94)",
      "text-halo-width": [
        "match",
        ["get", "place"],
        "city", 2,
        "town", 1.4,
        1,
      ],
      "text-halo-blur": 0.6,
    },
  });
}

// ---- Public entry ----------------------------------------------------

export async function addOsmOverlays(map: Map) {
  const data = await fetchOverpass();
  if (!data || (!data.roads.features.length && !data.places.features.length)) {
    console.warn("[osm] no data available — skipping OSM overlay");
    return;
  }

  if (!map.getSource("osm-roads")) {
    map.addSource("osm-roads", { type: "geojson", data: data.roads });
  }
  if (!map.getSource("osm-places")) {
    map.addSource("osm-places", { type: "geojson", data: data.places });
  }

  addRoadLayers(map);
  addPlaceLayers(map);
}
