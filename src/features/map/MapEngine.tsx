import { memo, useEffect, useRef, useState, forwardRef, useImperativeHandle, useMemo } from "react";
import maplibregl, { Map as MapLibreMap } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  INITIAL_VIEW_STATE,
  MAP_FIT_BOUNDS,
  MAP_MAX_BOUNDS,
  MAP_STYLE_URL,
  MAP_ZOOM_LIMITS,
} from "../../config/mapConfig";
import type { MapEngineHandles } from "@/shared/types";
import { infrastructureLayers, interactiveLayerIds } from "../../config/layers";
import { addBasemapOverlay } from "./overlays/basemap";
import { addBoundaryLayers, loadRegionBoundary, updateBoundaryFilter } from "./overlays/adminBoundaries";
import { applyTacticalSky, tuneMapLabels } from "./overlays/labels";
import { softenIntelligenceLayers } from "./overlays/intelligence";
import { loadHeavyOverlays } from "./overlays";
import { startFocusPulse } from "./animation/focusPulse";
import { attachInteractivePopups } from "./interactions/popup";
import { fitRegionBounds } from "@/shared/lib/mapCamera";
import { getRegionFromUrl, setRegionInUrl, clearRegionFromUrl } from "@/shared/lib/regionUrl";
import { useRegionStore } from "@/shared/store/region";
import { loadStatesRegistry, getStatesFeatureCollection, getStateFeatureById } from "@/features/regions/loadStatesRegistry";
import { addIndiaStatesLayers, filterSelectedState, updateChoroplethIndicator, stateIdToNumericId, INDIA_STATES_FILL_ID } from "./overlays/indiaStates";
import { STATE_INDICATORS_DATA } from "../../data/stateIndicators";

const getIndicatorLabel = (key: string) => {
  switch (key) {
    case "overall": return "Overall Index";
    case "population": return "Population Index";
    case "infrastructure": return "Infrastructure Index";
    case "health": return "Health Index";
    case "education": return "Education Index";
    case "agriculture": return "Agriculture Index";
    case "connectivity": return "Connectivity Index";
    case "power": return "Power Coverage";
    default: return "Index";
  }
};

const getRankForIndicator = (stateId: string, indicator: string): number => {
  const sorted = Object.values(STATE_INDICATORS_DATA)
    .map((s) => ({ id: s.id, score: s.metrics[indicator as keyof typeof s.metrics] ?? 0 }))
    .sort((a, b) => b.score - a.score);
  const index = sorted.findIndex((s) => s.id === stateId);
  return index !== -1 ? index + 1 : 0;
};

function MapEngine(
  { activeLayers, embedded, activeIndicator = "overall" }: { activeLayers: Record<string, boolean>; embedded?: boolean; activeIndicator?: string },
  ref: React.Ref<MapEngineHandles | null>,
) {
  const mapNodeRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [showLegend, setShowLegend] = useState(true);
  const [bearing, setBearing] = useState(0);
  // Removed mouse-following tooltip tracking logic to migrate to a fixed selection panel.
  
  const activeRegionId = useRegionStore((state) => state.activeRegionId);
  const setBoundaryLoaded = useRegionStore((state) => state.setBoundaryLoaded);
  const setHistory = useRegionStore((state) => state.setHistory);
  const registryReady = useRegionStore((state) => state.registryReady);
  const selectRegion = useRegionStore((state) => state.selectRegion);
  const clearSelection = useRegionStore((state) => state.clearSelection);

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showUnderDevModal, setShowUnderDevModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [hoveredStateData, setHoveredStateData] = useState<{ id: string; name: string; score: number; rank: number; x: number; y: number } | null>(null);

  const getMapPadding = () => {
    const width = mapNodeRef.current?.clientWidth ?? 1000;
    const hasPanel = !!activeRegionId;
    if (width < 800) {
      return {
        top: 40,
        bottom: 40,
        left: 50,
        right: hasPanel ? (50 + 260) : 50,
      };
    } else {
      return {
        top: 60,
        bottom: 60,
        left: 100,
        right: hasPanel ? (100 + 320) : 100,
      };
    }
  };

  const handleResetView = () => {
    const map = mapRef.current;
    if (!map) return;
    map.fitBounds(MAP_FIT_BOUNDS as [[number, number], [number, number]], {
      padding: getMapPadding(),
      duration: 800,
    });
    map.easeTo({ pitch: INITIAL_VIEW_STATE.pitch, bearing: INITIAL_VIEW_STATE.bearing, duration: 800 });
  };

  const handleResetNorth = () => {
    const map = mapRef.current;
    if (!map) return;
    map.easeTo({ bearing: 0, pitch: 0, duration: 800 });
  };

  const handleZoomIn = () => {
    const map = mapRef.current;
    if (!map) return;
    map.zoomIn({ duration: 300 });
  };

  const handleZoomOut = () => {
    const map = mapRef.current;
    if (!map) return;
    map.zoomOut({ duration: 300 });
  };

  const toggleLegend = () => {
    setShowLegend((prev) => !prev);
  };

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    const onRotate = () => setBearing(map.getBearing());
    map.on("rotate", onRotate);
    return () => {
      map.off("rotate", onRotate);
    };
  }, [mapReady]);

  // Map lifecycle: create once, dispose on unmount.
  useEffect(() => {
    if (!mapNodeRef.current || mapRef.current) return undefined;

    let stopAnimation = () => {};
    let cancelled = false;

    const map = new maplibregl.Map({
      container: mapNodeRef.current as HTMLElement,
      style: MAP_STYLE_URL,
      center: INITIAL_VIEW_STATE.center as [number, number],
      zoom: INITIAL_VIEW_STATE.zoom,
      pitch: INITIAL_VIEW_STATE.pitch,
      bearing: INITIAL_VIEW_STATE.bearing,
      maxBounds: MAP_MAX_BOUNDS as [ [number, number], [number, number] ],
      minZoom: MAP_ZOOM_LIMITS.min,
      maxZoom: MAP_ZOOM_LIMITS.max,
      attributionControl: false,
    });

    mapRef.current = map;
    map.addControl(new maplibregl.ScaleControl({ unit: "metric" }), "bottom-right");
    map.addControl(new maplibregl.ScaleControl({ unit: "metric" }), "bottom-right");
    map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");

    const resizeObserver = new ResizeObserver(() => {
      map.resize();
      try {
        map.fitBounds(MAP_FIT_BOUNDS as [[number, number], [number, number]], {
          padding: getMapPadding(),
          duration: 0,
        });
      } catch (e) {
        // ignore if style not loaded yet
      }
    });
    resizeObserver.observe(mapNodeRef.current);

    map.on("load", async () => {
      console.info("[map] load fired");
      applyTacticalSky(map);
      addBasemapOverlay(map);
      tuneMapLabels(map);

      // Load state registry + source data upfront
      await loadStatesRegistry();
      const statesData = getStatesFeatureCollection();
      if (statesData) {
        addIndiaStatesLayers(map, statesData, activeIndicator);
        console.info("[states] layers added", {
          source: !!map.getSource("india-states-source"),
          fill: !!map.getLayer("india-states-fill"),
          outline: !!map.getLayer("india-states-outline"),
          labelSource: !!map.getSource("india-states-label-source"),
          labelLayer: !!map.getLayer("india-states-label"),
        });
      }

      // Temporarily disable Overpass/OSM overlays during state explorer debug to avoid 429s.
      // addOsmOverlays(map).catch((err) => console.warn("[osm] failed:", err));

      // Region administrative boundaries (authoritative geometry, lazy-loaded per selection)
      addBoundaryLayers(map);

      // Lazy-load heavy GIS infrastructure overlays in parallel.
      await loadHeavyOverlays(map);
      if (cancelled) return;

      // Soften them into intelligence "sectors" (gradients, blur, glow).
      softenIntelligenceLayers(map);

      // Apply initial visibility immediately so overlays never flash on load.
      infrastructureLayers.forEach((layer) => {
        const visibility = activeLayers[layer.id] ? "visible" : "none";
        layer.mapLayerIds.forEach((layerId) => {
          if (map.getLayer(layerId)) {
            map.setLayoutProperty(layerId, "visibility", visibility);
          }
        });
      });

      map.fitBounds(MAP_FIT_BOUNDS as [[number, number], [number, number]], {
        padding: getMapPadding(),
        duration: 0,
      });


      stopAnimation = startFocusPulse(map);
      attachInteractivePopups(map);

      const source = map.getSource("india-states-source");
      console.info("[states] source present after load?", !!source);

      setMapReady(true);
    });

    return () => {
      cancelled = true;
      stopAnimation();
      resizeObserver.disconnect();
      setMapReady(false);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Initial URL sync on mount (gated by registry)
  useEffect(() => {
    if (!registryReady) return;
    const urlRegion = getRegionFromUrl();
    if (urlRegion) {
      setHistory([urlRegion]);
    }
  }, [registryReady, setHistory]);

  // Browser navigation: sync URL -> store
  useEffect(() => {
    if (!registryReady) return;
    const handler = () => {
      const urlRegion = getRegionFromUrl();
      if (urlRegion) {
        setHistory([urlRegion]);
      } else {
        setHistory([]);
      }
    };

    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, [registryReady, setHistory]);

  // When store changes, sync URL (only for Bihar to avoid navigation for other states)
  useEffect(() => {
    if (!registryReady) return;
    if (activeRegionId === "bihar") {
      setRegionInUrl(activeRegionId);
    } else {
      clearRegionFromUrl();
    }
  }, [activeRegionId, registryReady]);

  // When map and store are ready, move camera (only for Bihar to prevent camera shifts for other states)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    if (!registryReady) return;
    if (activeRegionId === "bihar") {
      const regionObj = getStateFeatureById("bihar");
      if (!regionObj) {
        console.warn("[MapEngine before fit] region missing", "bihar");
        return;
      }
      console.log("[MapEngine before fit]", "bihar", regionObj);
      fitRegionBounds(map, "bihar", { animate: true });
    } else {
      // Smoothly refit to national overview when region is deselected or non-Bihar state selected
      map.fitBounds(MAP_FIT_BOUNDS as [[number, number], [number, number]], {
        padding: getMapPadding(),
        duration: 800,
      });
    }
  }, [activeRegionId, mapReady, registryReady]);

  // Administrative boundaries: load + filter on active region changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    if (!activeRegionId) {
      updateBoundaryFilter(map, null);
      setBoundaryLoaded(false);
      console.info("[boundary] activeRegionId cleared");
      return;
    }

    const region = activeRegionId;
    const regionData = region ? region : null;
    console.info(`[boundary] activeRegionId=${regionData}`);

    // For states, reuse india-states source geometry for highlight to avoid extra fetches.
    const stateFeature = region ? getStateFeatureById(region) : null;
    const boundarySource = map.getSource("region-boundary") as any;
    if (stateFeature && boundarySource) {
      const enriched = {
        type: "FeatureCollection",
        features: [
          {
            ...stateFeature,
            properties: { ...(stateFeature.properties ?? {}), regionId: region },
          },
        ],
      } as const;
      boundarySource.setData(enriched);
      setBoundaryLoaded(true);
      updateBoundaryFilter(map, activeRegionId);
    } else if (activeRegionId) {
      loadRegionBoundary(map, activeRegionId)
        .then((data) => {
          if (data) {
            setBoundaryLoaded(true);
            updateBoundaryFilter(map, activeRegionId);
            console.info(`[boundary] loaded for ${activeRegionId}`);
          } else {
            setBoundaryLoaded(false);
            updateBoundaryFilter(map, null);
            console.info(`[boundary] missing for ${activeRegionId}`);
            console.info(`[region] boundary missing for ${activeRegionId}`);
          }
        })
        .catch((err) => {
          setBoundaryLoaded(false);
          updateBoundaryFilter(map, null);
          console.warn(`[boundary] failed for ${activeRegionId}`, err);
        });
    }
  }, [activeRegionId, mapReady, setBoundaryLoaded]);

  // State fill filter to avoid double highlight
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    filterSelectedState(map, activeRegionId);
  }, [activeRegionId, mapReady]);

  // Map interaction logic for states (hover highlights boundary, click selects state)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    let hoveredStateId: string | null = null;

    const hoverOn = (event: any) => {
      map.getCanvas().style.cursor = "pointer";
      if (event.features && event.features.length > 0) {
        const stateId = event.features[0].properties.id;
        const numericId = stateIdToNumericId[stateId];
        if (numericId !== undefined) {
          if (hoveredStateId !== null && hoveredStateId !== stateId) {
            const oldNumericId = stateIdToNumericId[hoveredStateId];
            if (oldNumericId !== undefined) {
              map.setFeatureState(
                { source: "india-states-source", id: oldNumericId },
                { hover: false }
              );
              map.setFeatureState(
                { source: "india-states-label-source", id: oldNumericId },
                { hover: false }
              );
            }
          }
          hoveredStateId = stateId;
          map.setFeatureState(
            { source: "india-states-source", id: numericId },
            { hover: true }
          );
          map.setFeatureState(
            { source: "india-states-label-source", id: numericId },
            { hover: true }
          );

          // Update React state for hover preview tooltip
          const stateData = STATE_INDICATORS_DATA[stateId];
          if (stateData) {
            const score = stateData.metrics[activeIndicator as keyof typeof stateData.metrics] ?? 0;
            const rank = getRankForIndicator(stateId, activeIndicator);
            setHoveredStateData({
              id: stateId,
              name: stateData.name,
              score,
              rank,
              x: event.point.x,
              y: event.point.y,
            });
          }
        }
      }
    };

    const hoverOff = () => {
      map.getCanvas().style.cursor = "";
      if (hoveredStateId !== null) {
        const numericId = stateIdToNumericId[hoveredStateId];
        if (numericId !== undefined) {
          map.setFeatureState(
            { source: "india-states-source", id: numericId },
            { hover: false }
          );
          map.setFeatureState(
            { source: "india-states-label-source", id: numericId },
            { hover: false }
          );
        }
      }
      hoveredStateId = null;
      setHoveredStateData(null);
    };

    map.on("mousemove", "india-states-fill", hoverOn);
    map.on("mouseleave", "india-states-fill", hoverOff);

    return () => {
      map.off("mousemove", "india-states-fill", hoverOn);
      map.off("mouseleave", "india-states-fill", hoverOff);
    };
  }, [mapReady, activeIndicator]);

  // Click handler to select region on state click, or clear selection on background click
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    const handleClick = (e: any) => {
      // 1. If click hits interactive infrastructure layer points/corridors, let their popup logic handle it
      const interactiveFeatures = map.queryRenderedFeatures(e.point, {
        layers: interactiveLayerIds.filter(id => map.getLayer(id)),
      });
      if (interactiveFeatures.length > 0) {
        return;
      }

      // 2. Query state features under the click
      const features = map.queryRenderedFeatures(e.point, {
        layers: [INDIA_STATES_FILL_ID],
      });

      if (features && features.length > 0) {
        const stateId = features[0].properties.id;
        console.log("[MapEngine click] clicked state:", stateId);
        selectRegion(stateId);
      } else {
        console.log("[MapEngine click] clicked outside states, clearing selection");
        clearSelection();
      }
    };

    map.on("click", handleClick);
    return () => {
      map.off("click", handleClick);
    };
  }, [mapReady, selectRegion, clearSelection]);

  // Trigger toast notification when activeRegionId changes to a state under development
  useEffect(() => {
    if (activeRegionId && activeRegionId !== "bihar") {
      const stateData = STATE_INDICATORS_DATA[activeRegionId];
      const name = stateData?.name || activeRegionId;
      setToastMessage(`Module Under Development: ${name} detailed analysis is coming soon.`);
      const timer = setTimeout(() => setToastMessage(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [activeRegionId]);

  // Sync active indicator on change
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    updateChoroplethIndicator(map, activeIndicator);
  }, [activeIndicator, mapReady]);

  // Layer visibility sync — only repaints when activeLayers changes.
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

  const selectedStateData = useMemo(() => {
    if (!activeRegionId) return null;
    const stateData = STATE_INDICATORS_DATA[activeRegionId];
    if (!stateData) return null;

    const score = stateData.metrics[activeIndicator as keyof typeof stateData.metrics] ?? 0;
    const rank = getRankForIndicator(activeRegionId, activeIndicator);

    return {
      id: activeRegionId,
      name: stateData.name,
      score,
      rank,
      population: stateData.populationText,
      gdp: stateData.gdpText ?? "",
      metrics: stateData.metrics,
    };
  }, [activeRegionId, activeIndicator]);

  const width = mapNodeRef.current?.clientWidth ?? 1000;
  const tooltipStyle: React.CSSProperties = selectedStateData ? {
    position: "absolute",
    right: width < 800 ? "12px" : "24px",
    top: width < 800 ? "70px" : "120px",
    zIndex: 100,
    pointerEvents: "auto",
    display: "block",
  } : { display: "none" };

  useImperativeHandle(ref, () => ({
    addInfraLayer: (layerId: string) => {
      const map = mapRef.current;
      if (!map) return;
      const layer = infrastructureLayers.find((l) => l.id === layerId);
      if (!layer) return;
      layer.mapLayerIds.forEach((lid) => {
        if (map.getLayer(lid)) map.setLayoutProperty(lid, "visibility", "visible");
      });
    },
    removeInfraLayer: (layerId: string) => {
      const map = mapRef.current;
      if (!map) return;
      const layer = infrastructureLayers.find((l) => l.id === layerId);
      if (!layer) return;
      layer.mapLayerIds.forEach((lid) => {
        if (map.getLayer(lid)) map.setLayoutProperty(lid, "visibility", "none");
      });
    },
    flyToRegion: (center: [number, number], zoom?: number) => {
      const map = mapRef.current;
      if (!map) return;
      map.easeTo({ center, zoom: zoom ?? map.getZoom(), duration: 800 });
    },
  }));

  if (embedded) {
    return (
      <div className="map-card-shell" aria-label="Interactive GIS map">
        <div ref={mapNodeRef} className="map-card-canvas" />
        
        <div className="state-map__controls-overlay">
          <button
            type="button"
            className={`map-control-btn${showLegend ? " is-active" : ""}`}
            onClick={toggleLegend}
            title="Toggle Legend"
          >
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" strokeWidth="3" />
              <line x1="3" y1="12" x2="3.01" y2="12" strokeWidth="3" />
              <line x1="3" y1="18" x2="3.01" y2="18" strokeWidth="3" />
            </svg>
            <span>Legend</span>
          </button>
          <button
            type="button"
            className="map-control-btn"
            onClick={handleResetView}
            title="Reset Map View"
          >
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </svg>
            <span>Reset View</span>
          </button>
          <button
            type="button"
            className="map-control-btn icon-only"
            onClick={handleZoomIn}
            title="Zoom In"
          >
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          <button
            type="button"
            className="map-control-btn icon-only"
            onClick={handleZoomOut}
            title="Zoom Out"
          >
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          <button
            type="button"
            className="map-control-btn compass-btn"
            onClick={handleResetNorth}
            title="Reset North"
            style={{ transform: `rotate(${-bearing}deg)` }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path d="M12 4l3 7H9z" fill="#ef4444" />
              <path d="M12 20l-3-7h6z" fill="#cbd5e1" stroke="#cbd5e1" strokeWidth="1" />
            </svg>
          </button>
        </div>

        {showLegend && (
          <div className="state-map__legend-card">
            <div className="legend-title">{getIndicatorLabel(activeIndicator).toUpperCase()}</div>
            <div className="legend-gradient-container">
              <div className="legend-gradient-bar" />
              <div className="legend-gradient-labels">
                <div className="legend-gradient-label">
                  <span className="legend-val">80 – 100</span>
                  <span className="legend-desc">Very High</span>
                </div>
                <div className="legend-gradient-label">
                  <span className="legend-val">60 – 80</span>
                  <span className="legend-desc">High</span>
                </div>
                <div className="legend-gradient-label">
                  <span className="legend-val">40 – 60</span>
                  <span className="legend-desc">Medium</span>
                </div>
                <div className="legend-gradient-label">
                  <span className="legend-val">20 – 40</span>
                  <span className="legend-desc">Low</span>
                </div>
                <div className="legend-gradient-label">
                  <span className="legend-val">0 – 20</span>
                  <span className="legend-desc">Very Low</span>
                </div>
              </div>
            </div>
            <div className="legend-footer">Higher value indicates better performance</div>
          </div>
        )}

        {selectedStateData && (
          <div
            className="state-map__tooltip"
            style={tooltipStyle}
          >
            <div className="tooltip-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%", gap: "8px" }}>
              <div className="tooltip-title" style={{ margin: 0 }}>{selectedStateData.name}</div>
              <button
                type="button"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "rgba(255, 255, 255, 0.4)",
                  cursor: "pointer",
                  fontSize: "18px",
                  padding: "0 2px",
                  lineHeight: 1,
                  marginTop: "-2px"
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  clearSelection();
                }}
                title="Close Panel"
              >
                &times;
              </button>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: "4px" }}>
              <div className="tooltip-rank-badge">RANK #{selectedStateData.rank}</div>
            </div>
            <div className="tooltip-score-section">
              <span className="tooltip-score-val">{selectedStateData.score.toFixed(1)}</span>
              <span className="tooltip-score-label">{getIndicatorLabel(activeIndicator).toUpperCase()}</span>
            </div>
            <div className="tooltip-divider" />
            <div className="tooltip-metadata">
              <div className="tooltip-meta-row">
                <span className="tooltip-meta-label">Population</span>
                <span className="tooltip-meta-val">{selectedStateData.population}</span>
              </div>
              <div className="tooltip-meta-row">
                <span className="tooltip-meta-label">GDP (Nominal)</span>
                <span className="tooltip-meta-val">{selectedStateData.gdp}</span>
              </div>
            </div>
            <button
              type="button"
              className="tooltip-cta"
              disabled={selectedStateData.id !== "bihar"}
              onClick={() => {
                if (selectedStateData.id === "bihar") {
                  setShowDetailsModal(true);
                }
              }}
            >
              {selectedStateData.id === "bihar"
                ? "Open Intelligence →"
                : "Coming Soon"}
            </button>
          </div>
        )}

        {showDetailsModal && selectedStateData && (
          <div className="state-map__modal-overlay" onClick={() => setShowDetailsModal(false)}>
            <div className="state-map__modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="state-map__modal-close" onClick={() => setShowDetailsModal(false)}>
                &times;
              </button>
              <div className="state-map__modal-header">
                <h3>{selectedStateData.name} Detailed Report</h3>
                <span className="state-map__modal-badge">
                  RANK #{selectedStateData.rank} (Indicator: {getIndicatorLabel(activeIndicator)})
                </span>
              </div>
              <div className="state-map__modal-body">
                <div className="modal-info-grid">
                  <div className="modal-info-item">
                    <span className="modal-info-label">Population</span>
                    <span className="modal-info-value">{selectedStateData.population}</span>
                  </div>
                  <div className="modal-info-item">
                    <span className="modal-info-label">GDP (Nominal)</span>
                    <span className="modal-info-value">{selectedStateData.gdp}</span>
                  </div>
                </div>
                <div className="state-map__modal-divider" />
                <div className="modal-metrics-section">
                  <h4>Development Indicators (Out of 100)</h4>
                  <div className="modal-metrics-grid">
                    {Object.entries(selectedStateData.metrics).map(([key, value]) => {
                      const val = value as number;
                      return (
                        <div key={key} className="modal-metric-card">
                          <div className="modal-metric-header">
                            <span className="modal-metric-name">{getIndicatorLabel(key)}</span>
                            <span className="modal-metric-score">{val.toFixed(1)} / 100</span>
                          </div>
                          <div className="modal-metric-progress-bg">
                            <div
                              className="modal-metric-progress-bar"
                              style={{
                                width: `${val}%`,
                                background:
                                  val >= 75
                                    ? "#23B68B"
                                    : val >= 60
                                    ? "#1F8EDB"
                                    : val >= 40
                                    ? "#0E4DB3"
                                    : "#081F5C",
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showUnderDevModal && selectedStateData && (
          <div className="state-map__modal-overlay" onClick={() => setShowUnderDevModal(false)}>
            <div className="state-map__modal-content" style={{ maxWidth: "450px" }} onClick={(e) => e.stopPropagation()}>
              <button className="state-map__modal-close" onClick={() => setShowUnderDevModal(false)}>
                &times;
              </button>
              <div className="state-map__modal-header" style={{ textAlign: "center", marginBottom: "16px" }}>
                <div style={{ fontSize: "42px", marginBottom: "12px" }}>🚧</div>
                <h3 style={{ fontSize: "20px" }}>Module Under Development</h3>
                <span className="state-map__modal-badge" style={{ borderColor: "rgba(245, 158, 11, 0.4)", color: "#f59e0b", background: "rgba(245, 158, 11, 0.1)" }}>
                  {selectedStateData.name} Analysis
                </span>
              </div>
              <div className="state-map__modal-body" style={{ textAlign: "center", gap: "12px" }}>
                <p style={{ color: "rgba(232, 238, 248, 0.75)", fontSize: "13px", lineHeight: "1.5", margin: "0 0 10px 0" }}>
                  Detailed intelligence reports, district-level drilldowns, and automated data streams for <strong>{selectedStateData.name}</strong> are currently under construction.
                </p>
                <p style={{ color: "rgba(232, 238, 248, 0.6)", fontSize: "11px", lineHeight: "1.4" }}>
                  Please select <strong>Bihar</strong> from the map or states list to view a fully operational intelligence report.
                </p>
                <button
                  type="button"
                  className="tooltip-cta"
                  style={{
                    background: "#f59e0b !important",
                    boxShadow: "0 0 10px rgba(245, 158, 11, 0.35)",
                    marginTop: "16px !important",
                    pointerEvents: "auto",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setShowUnderDevModal(false);
                    selectRegion("bihar");
                  }}
                >
                  Switch to Bihar Overview
                </button>
              </div>
            </div>
          </div>
        )}

        {toastMessage && (
          <div
            style={{
              position: "absolute",
              top: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(15, 23, 42, 0.95)",
              border: "1px solid rgba(245, 158, 11, 0.4)",
              borderRadius: "8px",
              padding: "10px 18px",
              color: "#f59e0b",
              fontSize: "11px",
              fontWeight: "700",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.6), 0 0 15px rgba(245, 158, 11, 0.15)",
              zIndex: 3000,
              display: "flex",
              alignItems: "center",
              gap: "10px",
              animation: "slideDown 0.25s ease-out",
            }}
          >
            <span style={{ fontSize: "14px" }}>⚠️</span>
            <span>{toastMessage}</span>
          </div>
        )}

        {hoveredStateData && (!activeRegionId || hoveredStateData.id !== activeRegionId) && (
          <div
            className="state-map__preview-tooltip"
            style={{
              left: hoveredStateData.x + 16,
              top: hoveredStateData.y - 12,
            }}
          >
            <div className="preview-title">{hoveredStateData.name}</div>
            {hoveredStateData.id === "bihar" ? (
              <>
                <div className="preview-row">
                  <span className="preview-label">Rank</span>
                  <span className="preview-val">#{hoveredStateData.rank}</span>
                </div>
                <div className="preview-row">
                  <span className="preview-label">Score</span>
                  <span className="preview-score">{hoveredStateData.score.toFixed(1)}</span>
                </div>
                <div className="preview-row" style={{ marginTop: "2px" }}>
                  <span className="preview-label">Status</span>
                  <span className="preview-status-badge active">Active</span>
                </div>
              </>
            ) : (
              <>
                <div className="preview-row" style={{ marginTop: "2px" }}>
                  <span className="preview-label" style={{ fontWeight: 600 }}>Status</span>
                  <span className="preview-status-badge under-dev">Under Development</span>
                </div>
                <div style={{ fontSize: "9.5px", color: "rgba(232, 238, 248, 0.65)", marginTop: "4px", lineHeight: "1.3" }}>
                  District Workspace Coming Soon
                </div>
                <div style={{ 
                  fontSize: "8.5px", 
                  color: "#38bdf8", 
                  opacity: 0.85, 
                  marginTop: "6px", 
                  borderTop: "1px solid rgba(255, 255, 255, 0.08)", 
                  paddingTop: "5px",
                  lineHeight: "1.2",
                  fontStyle: "italic"
                }}>
                  Bihar is currently the pilot intelligence workspace.
                </div>
              </>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="gis-map-shell" aria-label="Interactive GIS map">
      <div ref={mapNodeRef} className="gis-map" />
      <div className="gis-map__ambient" aria-hidden="true" />
      <div className="gis-map__fog" aria-hidden="true" />
      <div className="gis-map__illumination" aria-hidden="true" />
      <div className="gis-map__texture" aria-hidden="true" />
      <div className="gis-map__grain" aria-hidden="true" />
      <div className="gis-map__focus-glow" aria-hidden="true" />
      <div className="gis-map__vignette" aria-hidden="true" />
      
      <div className="state-map__controls-overlay">
        <button
          type="button"
          className={`map-control-btn${showLegend ? " is-active" : ""}`}
          onClick={toggleLegend}
          title="Toggle Legend"
        >
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" strokeWidth="3" />
            <line x1="3" y1="12" x2="3.01" y2="12" strokeWidth="3" />
            <line x1="3" y1="18" x2="3.01" y2="18" strokeWidth="3" />
          </svg>
          <span>Legend</span>
        </button>
        <button
          type="button"
          className="map-control-btn"
          onClick={handleResetView}
          title="Reset Map View"
        >
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
          </svg>
          <span>Reset View</span>
        </button>
        <button
          type="button"
          className="map-control-btn icon-only"
          onClick={handleZoomIn}
          title="Zoom In"
        >
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <button
          type="button"
          className="map-control-btn icon-only"
          onClick={handleZoomOut}
          title="Zoom Out"
        >
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <button
          type="button"
          className="map-control-btn compass-btn"
          onClick={handleResetNorth}
          title="Reset North"
          style={{ transform: `rotate(${-bearing}deg)` }}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <path d="M12 4l3 7H9z" fill="#ef4444" />
            <path d="M12 20l-3-7h6z" fill="#cbd5e1" stroke="#cbd5e1" strokeWidth="1" />
          </svg>
        </button>
      </div>

      {showLegend && (
        <div className="state-map__legend-card">
          <div className="legend-title">{getIndicatorLabel(activeIndicator).toUpperCase()}</div>
          <div className="legend-gradient-container">
            <div className="legend-gradient-bar" />
            <div className="legend-gradient-labels">
              <div className="legend-gradient-label">
                <span className="legend-val">80 – 100</span>
                <span className="legend-desc">Very High</span>
              </div>
              <div className="legend-gradient-label">
                <span className="legend-val">60 – 80</span>
                <span className="legend-desc">High</span>
              </div>
              <div className="legend-gradient-label">
                <span className="legend-val">40 – 60</span>
                <span className="legend-desc">Medium</span>
              </div>
              <div className="legend-gradient-label">
                <span className="legend-val">20 – 40</span>
                <span className="legend-desc">Low</span>
              </div>
              <div className="legend-gradient-label">
                <span className="legend-val">0 – 20</span>
                <span className="legend-desc">Very Low</span>
              </div>
            </div>
          </div>
          <div className="legend-footer">Higher value indicates better performance</div>
        </div>
      )}

      {selectedStateData && (
        <div
          className="state-map__tooltip"
          style={tooltipStyle}
        >
          <div className="tooltip-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%", gap: "8px" }}>
            <div className="tooltip-title" style={{ margin: 0 }}>{selectedStateData.name}</div>
            <button
              type="button"
              style={{
                background: "transparent",
                border: "none",
                color: "rgba(255, 255, 255, 0.4)",
                cursor: "pointer",
                fontSize: "18px",
                padding: "0 2px",
                lineHeight: 1,
                marginTop: "-2px"
              }}
              onClick={(e) => {
                e.stopPropagation();
                clearSelection();
              }}
              title="Close Panel"
            >
              &times;
            </button>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: "4px" }}>
            <div className="tooltip-rank-badge">RANK #{selectedStateData.rank}</div>
          </div>
          <div className="tooltip-score-section">
            <span className="tooltip-score-val">{selectedStateData.score.toFixed(1)}</span>
            <span className="tooltip-score-label">{getIndicatorLabel(activeIndicator).toUpperCase()}</span>
          </div>
          <div className="tooltip-divider" />
          <div className="tooltip-metadata">
            <div className="tooltip-meta-row">
              <span className="tooltip-meta-label">Population</span>
              <span className="tooltip-meta-val">{selectedStateData.population}</span>
            </div>
            <div className="tooltip-meta-row">
              <span className="tooltip-meta-label">GDP (Nominal)</span>
              <span className="tooltip-meta-val">{selectedStateData.gdp}</span>
            </div>
          </div>
          <button
            type="button"
            className="tooltip-cta"
            disabled={selectedStateData.id !== "bihar"}
            onClick={() => {
              if (selectedStateData.id === "bihar") {
                setShowDetailsModal(true);
              }
            }}
          >
            {selectedStateData.id === "bihar"
              ? "Open Intelligence →"
              : "Coming Soon"}
          </button>
        </div>
      )}

      {showDetailsModal && selectedStateData && (
        <div className="state-map__modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="state-map__modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="state-map__modal-close" onClick={() => setShowDetailsModal(false)}>
              &times;
            </button>
            <div className="state-map__modal-header">
              <h3>{selectedStateData.name} Detailed Report</h3>
              <span className="state-map__modal-badge">
                RANK #{selectedStateData.rank} (Indicator: {getIndicatorLabel(activeIndicator)})
              </span>
            </div>
            <div className="state-map__modal-body">
              <div className="modal-info-grid">
                <div className="modal-info-item">
                  <span className="modal-info-label">Population</span>
                  <span className="modal-info-value">{selectedStateData.population}</span>
                </div>
                <div className="modal-info-item">
                  <span className="modal-info-label">GDP (Nominal)</span>
                  <span className="modal-info-value">{selectedStateData.gdp}</span>
                </div>
              </div>
              <div className="state-map__modal-divider" />
              <div className="modal-metrics-section">
                <h4>Development Indicators (Out of 100)</h4>
                <div className="modal-metrics-grid">
                  {Object.entries(selectedStateData.metrics).map(([key, value]) => {
                    const val = value as number;
                    return (
                      <div key={key} className="modal-metric-card">
                        <div className="modal-metric-header">
                          <span className="modal-metric-name">{getIndicatorLabel(key)}</span>
                          <span className="modal-metric-score">{val.toFixed(1)} / 100</span>
                        </div>
                        <div className="modal-metric-progress-bg">
                          <div
                            className="modal-metric-progress-bar"
                            style={{
                              width: `${val}%`,
                              background:
                                val >= 75
                                  ? "#23B68B"
                                  : val >= 60
                                  ? "#1F8EDB"
                                  : val >= 40
                                  ? "#0E4DB3"
                                  : "#081F5C",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showUnderDevModal && selectedStateData && (
        <div className="state-map__modal-overlay" onClick={() => setShowUnderDevModal(false)}>
          <div className="state-map__modal-content" style={{ maxWidth: "450px" }} onClick={(e) => e.stopPropagation()}>
            <button className="state-map__modal-close" onClick={() => setShowUnderDevModal(false)}>
              &times;
            </button>
            <div className="state-map__modal-header" style={{ textAlign: "center", marginBottom: "16px" }}>
              <div style={{ fontSize: "42px", marginBottom: "12px" }}>🚧</div>
              <h3 style={{ fontSize: "20px" }}>Module Under Development</h3>
              <span className="state-map__modal-badge" style={{ borderColor: "rgba(245, 158, 11, 0.4)", color: "#f59e0b", background: "rgba(245, 158, 11, 0.1)" }}>
                {selectedStateData.name} Analysis
              </span>
            </div>
            <div className="state-map__modal-body" style={{ textAlign: "center", gap: "12px" }}>
              <p style={{ color: "rgba(232, 238, 248, 0.75)", fontSize: "13px", lineHeight: "1.5", margin: "0 0 10px 0" }}>
                Detailed intelligence reports, district-level drilldowns, and automated data streams for <strong>{selectedStateData.name}</strong> are currently under construction.
              </p>
              <p style={{ color: "rgba(232, 238, 248, 0.6)", fontSize: "11px", lineHeight: "1.4" }}>
                Please select <strong>Bihar</strong> from the map or states list to view a fully operational intelligence report.
              </p>
              <button
                type="button"
                className="tooltip-cta"
                style={{
                  background: "#f59e0b !important",
                  boxShadow: "0 0 10px rgba(245, 158, 11, 0.35)",
                  marginTop: "16px !important",
                  pointerEvents: "auto",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setShowUnderDevModal(false);
                  selectRegion("bihar");
                }}
              >
                Switch to Bihar Overview
              </button>
            </div>
          </div>
        </div>
      )}

      {toastMessage && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(15, 23, 42, 0.95)",
            border: "1px solid rgba(245, 158, 11, 0.4)",
            borderRadius: "8px",
            padding: "10px 18px",
            color: "#f59e0b",
            fontSize: "11px",
            fontWeight: "700",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.6), 0 0 15px rgba(245, 158, 11, 0.15)",
            zIndex: 3000,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            animation: "slideDown 0.25s ease-out",
          }}
        >
          <span style={{ fontSize: "14px" }}>⚠️</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {hoveredStateData && (!activeRegionId || hoveredStateData.id !== activeRegionId) && (
        <div
          className="state-map__preview-tooltip"
          style={{
            left: hoveredStateData.x + 16,
            top: hoveredStateData.y - 12,
          }}
        >
          <div className="preview-title">{hoveredStateData.name}</div>
          {hoveredStateData.id === "bihar" ? (
            <>
              <div className="preview-row">
                <span className="preview-label">Rank</span>
                <span className="preview-val">#{hoveredStateData.rank}</span>
              </div>
              <div className="preview-row">
                <span className="preview-label">Score</span>
                <span className="preview-score">{hoveredStateData.score.toFixed(1)}</span>
              </div>
              <div className="preview-row" style={{ marginTop: "2px" }}>
                <span className="preview-label">Status</span>
                <span className="preview-status-badge active">Active</span>
              </div>
            </>
          ) : (
            <>
              <div className="preview-row" style={{ marginTop: "2px" }}>
                <span className="preview-label" style={{ fontWeight: 600 }}>Status</span>
                <span className="preview-status-badge under-dev">Under Development</span>
              </div>
              <div style={{ fontSize: "9.5px", color: "rgba(232, 238, 248, 0.65)", marginTop: "4px", lineHeight: "1.3" }}>
                District Workspace Coming Soon
              </div>
              <div style={{ 
                fontSize: "8.5px", 
                color: "#38bdf8", 
                opacity: 0.85, 
                marginTop: "6px", 
                borderTop: "1px solid rgba(255, 255, 255, 0.08)", 
                paddingTop: "5px",
                lineHeight: "1.2",
                fontStyle: "italic"
              }}>
                Bihar is currently the pilot intelligence workspace.
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default memo(forwardRef(MapEngine));
