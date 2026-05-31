// Real OSM geographic data for the Kusheshwar Asthan floodplain region.
// Fetched live from Overpass API, cached in localStorage for 7 days.
// Renders:
//   - road network (motorway / trunk / primary / secondary / tertiary / residential)
//   - settlement labels (city / town / village / hamlet)

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

// Named priority sets — keep lower-case strings for matching.
const OPERATIONAL_NAMES = ["kusheshwar asthan"]; // operational-zone boost
const REGIONAL_MAJOR_NAMES = ["darbhanga", "madhubani", "samastipur", "benipatti", "jale"];
const OPERATIONAL_RING_NAMES = ["rampatti", "bahadurpur", "choraut", "nawada", "motipur", "bhagwanpur"];

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

function writeCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
  } catch {
    /* quota or storage disabled — cache is best-effort */
  }
}

// ---- Overpass fetch + GeoJSON shaping --------------------------------

function osmToGeoJson(osm) {
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
      const name = el.tags.name;
      const nameLc = typeof name === "string" ? name.toLowerCase() : undefined;
      places.features.push({
        type: "Feature",
        properties: {
          place: el.tags.place,
          name,
          name_lc: nameLc,
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

function addRoadLayers(map) {
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

function addPlaceLayers(map) {
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

  const isOperational = ["in", ["get", "name_lc"], ["literal", OPERATIONAL_NAMES]];
  const isRegionalMajor = ["in", ["get", "name_lc"], ["literal", REGIONAL_MAJOR_NAMES]];
  const isRing = ["in", ["get", "name_lc"], ["literal", OPERATIONAL_RING_NAMES]];
  const isCaptured = ["any", isOperational, isRegionalMajor, isRing];

  const textSizeCity = ["interpolate", ["linear"], ["zoom"], 8, 18, 11, 28, 13, 38];
  const textSizeTownBase = ["interpolate", ["linear"], ["zoom"], 9, 14, 11.5, 18.5, 14, 24];
  const textSizeVillage = ["interpolate", ["linear"], ["zoom"], 10.5, 11.5, 12.5, 13.5, 15, 15];
  const textSizeHamlet = ["interpolate", ["linear"], ["zoom"], 11, 10.2, 13, 10.8, 15, 11];

  const textColor = [
    "match",
    ["get", "place"],
    "city", "rgba(255, 255, 255, 0.96)",
    "town", "rgba(225, 235, 250, 0.84)",
    "village", "rgba(190, 205, 225, 0.68)",
    "rgba(170, 185, 205, 0.54)",
  ];

  const textHaloWidth = [
    "match",
    ["get", "place"],
    "city", 2,
    "town", 1.4,
    1,
  ];

  const textLetterSpacing = [
    "match",
    ["get", "place"],
    "city", 0.06,
    "town", 0.04,
    0.02,
  ];

  // Tier A: Operational zone + regional majors (strict collisions)
  map.addLayer({
    id: "osm-place-labels-tier-a",
    type: "symbol",
    source: "osm-places",
    filter: ["any", isOperational, isRegionalMajor],
    layout: {
      "text-field": ["get", "name"],
      "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
      "text-size": [
        "interpolate",
        ["linear"],
        ["zoom"],
        8,
        [
          "match",
          ["get", "place"],
          "city", 18 + 12,
          "town", 14 + 12,
          14,
        ],
        11,
        [
          "match",
          ["get", "place"],
          "city", 28 + 12,
          "town", 18.5 + 12,
          18.5,
        ],
        13,
        [
          "match",
          ["get", "place"],
          "city", 38 + 12,
          "town", 24 + 12,
          24,
        ],
      ],
      "text-letter-spacing": textLetterSpacing,
      "text-offset": [0, 1.2],
      "text-anchor": "top",
      "text-padding": 3,
      "text-allow-overlap": false,
      "symbol-sort-key": -20,
    },
    paint: {
      "text-color": textColor,
      "text-halo-color": "rgba(4, 10, 18, 0.95)",
      "text-halo-width": textHaloWidth,
      "text-halo-blur": 0.45,
    },
  });

  // Tier B: Priority ring settlements (aggressive visibility, variable anchors)
  map.addLayer({
    id: "osm-place-labels-tier-b",
    type: "symbol",
    source: "osm-places",
    filter: isRing,
    layout: {
      "text-field": ["get", "name"],
      "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
      "text-size": [
        "interpolate",
        ["linear"],
        ["zoom"],
        8,
        ["match", ["get", "place"], "city", 18, "town", 14, "village", 11.5, 10.2],
        11,
        ["match", ["get", "place"], "city", 28, "town", 18.5, "village", 13.5, 10.8],
        13,
        ["match", ["get", "place"], "city", 38, "town", 24, "village", 15, 11],
      ],
      "text-letter-spacing": textLetterSpacing,
      "text-variable-anchor": ["top", "bottom", "left", "right", "top-left", "top-right", "bottom-left", "bottom-right"],
      "text-radial-offset": 0.75,
      "text-padding": 1.5,
      "text-allow-overlap": true,
      "symbol-sort-key": -10,
    },
    paint: {
      "text-color": textColor,
      "text-halo-color": "rgba(4, 10, 18, 0.95)",
      "text-halo-width": textHaloWidth,
      "text-halo-blur": 0.45,
    },
  });

  // Tier C: Remaining towns + villages (moderate collisions)
  map.addLayer({
    id: "osm-place-labels-tier-c",
    type: "symbol",
    source: "osm-places",
    filter: [
      "all",
      ["in", ["get", "place"], ["literal", ["town", "village"]]],
      ["!", isCaptured],
    ],
    layout: {
      "text-field": ["get", "name"],
      "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
      "text-size": [
        "interpolate",
        ["linear"],
        ["zoom"],
        8,
        ["match", ["get", "place"], "town", 14, 11.5],
        11,
        ["match", ["get", "place"], "town", 18.5, 13.5],
        13,
        ["match", ["get", "place"], "town", 24, 15],
      ],
      "text-letter-spacing": textLetterSpacing,
      "text-variable-anchor": ["top", "bottom", "left", "right"],
      "text-radial-offset": ["interpolate", ["linear"], ["zoom"], 10, 0.35, 13, 0.55],
      "text-padding": ["interpolate", ["linear"], ["zoom"], 10, 2.2, 12, 1.6, 14, 1.2],
      "text-allow-overlap": ["step", ["zoom"], false, 12, true],
      "text-ignore-placement": ["step", ["zoom"], false, 13, true],
      "symbol-sort-key": -2,
    },
    paint: {
      "text-color": textColor,
      "text-halo-color": "rgba(4, 10, 18, 0.95)",
      "text-halo-width": textHaloWidth,
      "text-halo-blur": 0.45,
    },
  });

  // Tier D: Hamlets (lowest priority, relaxed)
  map.addLayer({
    id: "osm-place-labels-tier-d",
    type: "symbol",
    source: "osm-places",
    filter: [
      "all",
      ["==", ["get", "place"], "hamlet"],
      ["!", isCaptured],
    ],
    layout: {
      "text-field": ["get", "name"],
      "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
      "text-size": textSizeHamlet,
      "text-letter-spacing": textLetterSpacing,
      "text-variable-anchor": ["top", "bottom", "left", "right"],
      "text-radial-offset": 0.35,
      "text-padding": 1.2,
      "text-allow-overlap": true,
      "symbol-sort-key": 0,
    },
    paint: {
      "text-color": textColor,
      "text-halo-color": "rgba(4, 10, 18, 0.95)",
      "text-halo-width": textHaloWidth,
      "text-halo-blur": 0.45,
    },
  });
}

// ---- Public entry ----------------------------------------------------

export async function addOsmOverlays(map) {
  const data = await fetchOverpass();
  if (!data || (!data.roads.features.length && !data.places.features.length)) {
    console.warn("[osm] no data available — skipping OSM overlay");
    return;
  }

   // Ensure downstream layers always have normalized names.
  if (data.places?.features) {
    data.places.features = data.places.features.map((f) => {
      const name = f.properties?.name;
      const name_lc = typeof name === "string" ? name.toLowerCase() : undefined;
      return {
        ...f,
        properties: {
          ...f.properties,
          name,
          name_lc,
        },
      };
    });
  }

  if (!map.getSource("osm-roads")) {
    map.addSource("osm-roads", { type: "geojson", data: data.roads });
  }
  if (!map.getSource("osm-places")) {
    map.addSource("osm-places", { type: "geojson", data: data.places });
  }

  // ---- Temporary Tier-B audit (minimal) -----------------------------
  try {
    const features = data.places.features || [];
    const isRing = (f) => OPERATIONAL_RING_NAMES.includes(f.properties?.name_lc);
    const tierBFeatures = features.filter(isRing);
    const tierBNames = tierBFeatures.map((f) => ({ name: f.properties?.name, name_lc: f.properties?.name_lc, place: f.properties?.place }));
    const focusNames = ["bahadurpur", "nawada", "motipur", "bhagwanpur"];
    const focusFeatures = features
      .filter((f) => focusNames.includes(f.properties?.name?.toLowerCase?.()))
      .map((f) => ({
        name: f.properties?.name,
        name_lc: f.properties?.name_lc,
        place: f.properties?.place,
        isRing: isRing(f),
        sourceLayer: f.properties?.source || null,
        filterInputs: { ringList: OPERATIONAL_RING_NAMES, candidate: f.properties?.name_lc },
      }));

    console.group("[osm][audit][tier-b]");
    console.info("features count before tier layers", features.length);
    console.info("tierB filter expression (name_lc in OPERATIONAL_RING_NAMES)", OPERATIONAL_RING_NAMES);
    console.info("tierB feature count", tierBFeatures.length);
    console.info("tierB names matched", tierBNames);
    console.info("focus features (bahadurpur/nawada/motipur/bhagwanpur)", focusFeatures);
    console.groupEnd();
  } catch (err) {
    console.warn("[osm][audit][tier-b] failed", err);
  }

  addRoadLayers(map);
  addPlaceLayers(map);
}
