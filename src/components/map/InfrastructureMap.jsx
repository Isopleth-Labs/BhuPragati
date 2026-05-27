import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  INITIAL_VIEW_STATE,
  MAP_FIT_BOUNDS,
  MAP_MAX_BOUNDS,
  MAP_STYLE_URL,
} from "../../data/mapConfig";
import { infrastructureLayers } from "../../data/infrastructureLayers";
import {
  administrativeBoundaries,
  analysisGrid,
  agricultureData,
  commandCenter,
  electricityData,
  floodRiskData,
  healthcareData,
  roadData,
} from "../../data/geojson";

const sourceDefinitions = [
  ["administrative-boundaries", administrativeBoundaries],
  ["analysis-grid", analysisGrid],
  ["command-center", commandCenter],
  ["flood-risk", floodRiskData],
  ["road-network", roadData],
  ["healthcare-access", healthcareData],
  ["agriculture-belts", agricultureData],
  ["electricity-network", electricityData],
];

const interactiveLayerIds = [
  "darbhanga-district-line",
  "kusheshwar-focus-core",
  "flood-risk-fill",
  "flood-wetland-points",
  "road-corridors",
  "road-critical-nodes",
  "healthcare-access-points",
  "agriculture-belts-fill",
  "electricity-feeders",
  "electricity-assets",
];

function getPopupMarkup(properties) {
  const title = properties.title ?? "Infrastructure Signal";
  const status = properties.status ?? "Observed";
  const metric = properties.metric ?? "GIS intelligence layer";
  const note = properties.note ?? "Layer details are available in the dashboard.";

  return `
    <section class="map-popup">
      <div class="map-popup__eyebrow">${status}</div>
      <h3>${title}</h3>
      <p class="map-popup__metric">${metric}</p>
      <p>${note}</p>
    </section>
  `;
}

function getFitPadding(container) {
  const width = container?.clientWidth ?? 1200;

  if (width < 760) {
    return { top: 96, right: 24, bottom: 300, left: 24 };
  }

  if (width < 1120) {
    return { top: 104, right: 260, bottom: 230, left: 280 };
  }

  return { top: 92, right: 420, bottom: 210, left: 420 };
}

function addSource(map, [id, data]) {
  if (map.getSource(id)) return;

  map.addSource(id, {
    type: "geojson",
    data,
  });
}

function addLayer(map, layer, beforeId) {
  if (map.getLayer(layer.id)) return;
  map.addLayer(layer, beforeId);
}

function getFirstSymbolLayerId(map) {
  return map.getStyle().layers?.find((layer) => layer.type === "symbol")?.id;
}

function addHybridBasemap(map) {
  if (!map.getSource("satellite-texture")) {
    map.addSource("satellite-texture", {
      type: "raster",
      tiles: [
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      ],
      tileSize: 256,
      attribution: "Tiles (c) Esri",
    });
  }

  addLayer(
    map,
    {
      id: "satellite-texture",
      type: "raster",
      source: "satellite-texture",
      paint: {
        "raster-opacity": 0.28,
        "raster-brightness-min": 0,
        "raster-brightness-max": 0.34,
        "raster-contrast": 0.36,
        "raster-saturation": -0.72,
        "raster-fade-duration": 450,
      },
    },
    getFirstSymbolLayerId(map),
  );

  if (typeof map.setFog === "function") {
    map.setFog({
      color: "#06131e",
      "high-color": "#0f3148",
      "horizon-blend": 0.18,
      "space-color": "#02050a",
      "star-intensity": 0,
    });
  }
}

function addAdministrativeLayers(map) {
  const focusFilter = ["==", ["get", "boundaryType"], "focus"];
  const districtFilter = ["==", ["get", "boundaryType"], "district"];

  addLayer(map, {
    id: "darbhanga-district-fill",
    type: "fill",
    source: "administrative-boundaries",
    filter: districtFilter,
    paint: {
      "fill-color": "#061420",
      "fill-opacity": 0.12,
    },
  });

  addLayer(map, {
    id: "darbhanga-district-glow",
    type: "line",
    source: "administrative-boundaries",
    filter: districtFilter,
    paint: {
      "line-color": "#1d8cff",
      "line-width": 12,
      "line-opacity": 0.12,
      "line-blur": 10,
    },
  });

  addLayer(map, {
    id: "darbhanga-district-line",
    type: "line",
    source: "administrative-boundaries",
    filter: districtFilter,
    paint: {
      "line-color": "#5fa8d8",
      "line-width": 1.2,
      "line-opacity": 0.42,
    },
  });

  addLayer(map, {
    id: "kusheshwar-focus-fill",
    type: "fill",
    source: "administrative-boundaries",
    filter: focusFilter,
    paint: {
      "fill-color": "#ff3b2f",
      "fill-opacity": 0.075,
    },
  });

  addLayer(map, {
    id: "kusheshwar-focus-ambient",
    type: "fill",
    source: "administrative-boundaries",
    filter: focusFilter,
    paint: {
      "fill-color": "#ff3b2f",
      "fill-opacity": 0.045,
    },
  });

  addLayer(map, {
    id: "kusheshwar-focus-glow-xl",
    type: "line",
    source: "administrative-boundaries",
    filter: focusFilter,
    paint: {
      "line-color": "#ff2d20",
      "line-width": 30,
      "line-opacity": 0.22,
      "line-blur": 22,
    },
  });

  addLayer(map, {
    id: "kusheshwar-focus-glow-lg",
    type: "line",
    source: "administrative-boundaries",
    filter: focusFilter,
    paint: {
      "line-color": "#ff4b37",
      "line-width": 15,
      "line-opacity": 0.34,
      "line-blur": 8,
    },
  });

  addLayer(map, {
    id: "kusheshwar-focus-red-shadow",
    type: "line",
    source: "administrative-boundaries",
    filter: focusFilter,
    paint: {
      "line-color": "#8d0b08",
      "line-width": 7,
      "line-opacity": 0.82,
      "line-blur": 3,
    },
  });

  addLayer(map, {
    id: "kusheshwar-focus-core",
    type: "line",
    source: "administrative-boundaries",
    filter: focusFilter,
    paint: {
      "line-color": "#ff684d",
      "line-width": 3.2,
      "line-opacity": 0.98,
    },
  });

  addLayer(map, {
    id: "kusheshwar-focus-hotline",
    type: "line",
    source: "administrative-boundaries",
    filter: focusFilter,
    paint: {
      "line-color": "#ffe1d6",
      "line-width": 1,
      "line-opacity": 0.78,
    },
  });
}

function addAnalysisGridLayers(map) {
  addLayer(map, {
    id: "analysis-grid-glow",
    type: "line",
    source: "analysis-grid",
    paint: {
      "line-color": "#1ba6ff",
      "line-width": 10,
      "line-opacity": 0.075,
      "line-blur": 7,
    },
  });

  addLayer(map, {
    id: "analysis-grid-line",
    type: "line",
    source: "analysis-grid",
    paint: {
      "line-color": "#65d2ff",
      "line-width": 1,
      "line-opacity": 0.14,
      "line-dasharray": [1.5, 2.4],
    },
  });
}

function addCommandCenterLayers(map) {
  addLayer(map, {
    id: "command-pulse-outer",
    type: "circle",
    source: "command-center",
    paint: {
      "circle-radius": 68,
      "circle-color": "#ff3b2f",
      "circle-opacity": 0.11,
      "circle-blur": 0.6,
    },
  });

  addLayer(map, {
    id: "command-pulse-mid",
    type: "circle",
    source: "command-center",
    paint: {
      "circle-radius": 38,
      "circle-color": "#ff3b2f",
      "circle-opacity": 0.18,
      "circle-blur": 0.35,
    },
  });

  addLayer(map, {
    id: "command-ring-outer",
    type: "circle",
    source: "command-center",
    paint: {
      "circle-radius": 46,
      "circle-color": "#ff3b2f",
      "circle-opacity": 0.02,
      "circle-stroke-color": "#ff684d",
      "circle-stroke-width": 2,
      "circle-stroke-opacity": 0.7,
    },
  });

  addLayer(map, {
    id: "command-ring-inner",
    type: "circle",
    source: "command-center",
    paint: {
      "circle-radius": 23,
      "circle-color": "#ff3b2f",
      "circle-opacity": 0.03,
      "circle-stroke-color": "#ffd7ce",
      "circle-stroke-width": 1.5,
      "circle-stroke-opacity": 0.58,
    },
  });

  addLayer(map, {
    id: "command-core",
    type: "circle",
    source: "command-center",
    paint: {
      "circle-radius": 9,
      "circle-color": "#ff563f",
      "circle-stroke-color": "#ffd7ce",
      "circle-stroke-width": 2.8,
      "circle-stroke-opacity": 0.98,
    },
  });
}

function addFloodLayers(map) {
  const polygonFilter = ["==", ["geometry-type"], "Polygon"];
  const pointFilter = ["==", ["geometry-type"], "Point"];

  addLayer(map, {
    id: "flood-risk-glow",
    type: "line",
    source: "flood-risk",
    filter: polygonFilter,
    paint: {
      "line-color": "#ff4438",
      "line-width": 10,
      "line-blur": 11,
      "line-opacity": 0.15,
    },
  });

  addLayer(map, {
    id: "flood-risk-fill",
    type: "fill",
    source: "flood-risk",
    filter: polygonFilter,
    paint: {
      "fill-color": "#ff4438",
      "fill-opacity": [
        "interpolate",
        ["linear"],
        ["get", "intensity"],
        70,
          0.055,
        95,
        0.14,
      ],
    },
  });

  addLayer(map, {
    id: "flood-risk-outline",
    type: "line",
    source: "flood-risk",
    filter: polygonFilter,
    paint: {
      "line-color": "#ff9b8f",
      "line-width": 1.2,
      "line-opacity": 0.42,
    },
  });

  addLayer(map, {
    id: "flood-wetland-points",
    type: "circle",
    source: "flood-risk",
    filter: pointFilter,
    paint: {
      "circle-radius": [
        "interpolate",
        ["linear"],
        ["get", "areaHa"],
        0,
        5,
        500,
        17,
      ],
      "circle-color": "#ff4438",
      "circle-opacity": 0.5,
      "circle-stroke-color": "#ffd6cf",
      "circle-stroke-width": 1.6,
      "circle-stroke-opacity": 0.9,
    },
  });
}

function addRoadLayers(map) {
  addLayer(map, {
    id: "road-corridor-glow",
    type: "line",
    source: "road-network",
    filter: ["==", ["geometry-type"], "LineString"],
    paint: {
      "line-color": "#ffb020",
      "line-width": 10,
      "line-opacity": 0.12,
      "line-blur": 8,
    },
  });

  addLayer(map, {
    id: "road-corridors",
    type: "line",
    source: "road-network",
    filter: ["==", ["geometry-type"], "LineString"],
    paint: {
      "line-color": "#ffb020",
      "line-width": [
        "interpolate",
        ["linear"],
        ["get", "criticality"],
        60,
        3,
        90,
        6,
      ],
      "line-opacity": 0.76,
      "line-dasharray": [1.5, 0.8],
    },
  });

  addLayer(map, {
    id: "road-critical-nodes",
    type: "circle",
    source: "road-network",
    filter: ["==", ["geometry-type"], "Point"],
    paint: {
      "circle-radius": 8,
      "circle-color": "#ffb020",
      "circle-opacity": 0.72,
      "circle-stroke-color": "#fff3d1",
      "circle-stroke-width": 1.6,
    },
  });
}

function addHealthcareLayers(map) {
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

function addAgricultureLayers(map) {
  addLayer(map, {
    id: "agriculture-belts-fill",
    type: "fill",
    source: "agriculture-belts",
    paint: {
      "fill-color": "#3cff8f",
      "fill-opacity": [
        "interpolate",
        ["linear"],
        ["get", "intensity"],
        80,
        0.055,
        100,
        0.14,
      ],
    },
  });

  addLayer(map, {
    id: "agriculture-belts-outline",
    type: "line",
    source: "agriculture-belts",
    paint: {
      "line-color": "#a9ffc9",
      "line-width": 1.8,
      "line-opacity": 0.38,
      "line-dasharray": [2.4, 1.2],
    },
  });
}

function addElectricityLayers(map) {
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

function addInfrastructureLayers(map) {
  addFloodLayers(map);
  addAgricultureLayers(map);
  addRoadLayers(map);
  addHealthcareLayers(map);
  addElectricityLayers(map);
}

function animateTacticalLayers(map) {
  let animationFrame = 0;

  const animate = (time) => {
    const wave = (Math.sin(time / 920) + 1) / 2;
    const slowWave = (Math.sin(time / 1800) + 1) / 2;

    if (map.getLayer("command-pulse-outer")) {
      map.setPaintProperty("command-pulse-outer", "circle-radius", 58 + wave * 22);
      map.setPaintProperty("command-pulse-outer", "circle-opacity", 0.055 + (1 - wave) * 0.11);
    }

    if (map.getLayer("command-pulse-mid")) {
      map.setPaintProperty("command-pulse-mid", "circle-radius", 24 + wave * 18);
      map.setPaintProperty("command-pulse-mid", "circle-opacity", 0.1 + (1 - wave) * 0.16);
    }

    if (map.getLayer("command-ring-outer")) {
      map.setPaintProperty("command-ring-outer", "circle-radius", 36 + wave * 24);
      map.setPaintProperty("command-ring-outer", "circle-stroke-opacity", 0.18 + (1 - wave) * 0.58);
    }

    if (map.getLayer("command-ring-inner")) {
      map.setPaintProperty("command-ring-inner", "circle-radius", 18 + slowWave * 11);
      map.setPaintProperty("command-ring-inner", "circle-stroke-opacity", 0.24 + slowWave * 0.44);
    }

    if (map.getLayer("command-core")) {
      map.setPaintProperty("command-core", "circle-radius", 7 + slowWave * 3);
    }

    if (map.getLayer("kusheshwar-focus-glow-xl")) {
      map.setPaintProperty("kusheshwar-focus-glow-xl", "line-width", 24 + slowWave * 13);
      map.setPaintProperty("kusheshwar-focus-glow-xl", "line-opacity", 0.16 + slowWave * 0.12);
    }

    if (map.getLayer("kusheshwar-focus-hotline")) {
      map.setPaintProperty("kusheshwar-focus-hotline", "line-opacity", 0.5 + slowWave * 0.34);
    }

    animationFrame = requestAnimationFrame(animate);
  };

  animationFrame = requestAnimationFrame(animate);
  return () => cancelAnimationFrame(animationFrame);
}

export default function InfrastructureMap({ activeLayers }) {
  const mapNodeRef = useRef(null);
  const mapRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (!mapNodeRef.current || mapRef.current) return undefined;
    let stopAnimation = () => {};

    const map = new maplibregl.Map({
      container: mapNodeRef.current,
      style: MAP_STYLE_URL,
      ...INITIAL_VIEW_STATE,
      maxBounds: MAP_MAX_BOUNDS,
      minZoom: 8.8,
      maxZoom: 15.5,
      antialias: true,
      attributionControl: false,
    });

    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "top-right");
    map.addControl(new maplibregl.ScaleControl({ unit: "metric" }), "bottom-right");
    map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");

    const resizeObserver = new ResizeObserver(() => map.resize());
    resizeObserver.observe(mapNodeRef.current);

    map.on("load", () => {
      addHybridBasemap(map);
      sourceDefinitions.forEach((definition) => addSource(map, definition));
      addAnalysisGridLayers(map);
      addAdministrativeLayers(map);
      addInfrastructureLayers(map);
      addCommandCenterLayers(map);

      map.fitBounds(MAP_FIT_BOUNDS, {
        padding: getFitPadding(mapNodeRef.current),
        duration: 0,
      });

      map.easeTo({
        center: [86.27, 25.84],
        zoom: 10.33,
        pitch: INITIAL_VIEW_STATE.pitch,
        bearing: INITIAL_VIEW_STATE.bearing,
        duration: 900,
      });

      stopAnimation = animateTacticalLayers(map);

      interactiveLayerIds.forEach((layerId) => {
        map.on("mouseenter", layerId, () => {
          map.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseleave", layerId, () => {
          map.getCanvas().style.cursor = "";
        });
        map.on("click", layerId, (event) => {
          const feature = event.features?.[0];
          if (!feature) return;

          new maplibregl.Popup({
            closeButton: false,
            maxWidth: "300px",
            offset: 18,
          })
            .setLngLat(event.lngLat)
            .setHTML(getPopupMarkup(feature.properties ?? {}))
            .addTo(map);
        });
      });

      setMapReady(true);
    });

    return () => {
      stopAnimation();
      resizeObserver.disconnect();
      setMapReady(false);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    infrastructureLayers.forEach((layer) => {
      const visibility = activeLayers[layer.id] ? "visible" : "none";
      layer.mapLayerIds.forEach((layerId) => {
        if (map.getLayer(layerId)) {
          map.setLayoutProperty(layerId, "visibility", visibility);
        }
      });
    });

  }, [activeLayers, mapReady]);

  return (
    <div className="gis-map-shell" aria-label="Interactive GIS map of Kusheshwar Asthan">
      <div ref={mapNodeRef} className="gis-map" />
      <div className="gis-map__terrain-glow" aria-hidden="true" />
      <div className="gis-map__fog" aria-hidden="true" />
      <div className="gis-map__grid" aria-hidden="true" />
      <div className="gis-map__scanline" aria-hidden="true" />
      <div className="gis-map__vignette" aria-hidden="true" />
    </div>
  );
}
