import { memo, useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
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
import { infrastructureLayers } from "../../config/layers";
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
import { addIndiaStatesLayers, filterSelectedState } from "./overlays/indiaStates";

function MapEngine(
  { activeLayers, embedded }: { activeLayers: Record<string, boolean>; embedded?: boolean },
  ref: React.Ref<MapEngineHandles | null>,
) {
  const mapNodeRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const activeRegionId = useRegionStore((state) => state.activeRegionId);
  const setBoundaryLoaded = useRegionStore((state) => state.setBoundaryLoaded);
  const setHistory = useRegionStore((state) => state.setHistory);
  const registryReady = useRegionStore((state) => state.registryReady);
  const selectRegion = useRegionStore((state) => state.selectRegion);

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
    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "top-right");
    map.addControl(new maplibregl.ScaleControl({ unit: "metric" }), "bottom-right");
    map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");

    const resizeObserver = new ResizeObserver(() => map.resize());
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
        addIndiaStatesLayers(map, statesData);
        console.info("[states] layers added", {
          source: !!map.getSource("india-states-source"),
          fill: !!map.getLayer("india-states-fill"),
          outline: !!map.getLayer("india-states-outline"),
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
        padding: { top: 6, bottom: 6, left: 10, right: 10 },
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

  // When store changes, sync URL
  useEffect(() => {
    if (!registryReady) return;
    if (activeRegionId) {
      setRegionInUrl(activeRegionId);
    } else {
      clearRegionFromUrl();
    }
  }, [activeRegionId, registryReady]);

  // When map and store are ready, move camera
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    if (!registryReady) return;
    if (!activeRegionId) return;
    const regionObj = getStateFeatureById(activeRegionId);
    if (!regionObj) {
      console.warn("[MapEngine before fit] region missing", activeRegionId);
      return;
    }
    console.log("[MapEngine before fit]", activeRegionId, regionObj);
    fitRegionBounds(map, activeRegionId, { animate: true });
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

  // Map click selection for states
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    const clickHandler = (event: any) => {
      const feature = event?.features?.[0];
      const id = feature?.properties?.id;
      if (typeof id === "string") {
        console.info(`[state] selected=${id}`);
        selectRegion(id);
      }
    };

    let hoveredStateId: string | null = null;

    const hoverOn = (event: any) => {
      map.getCanvas().style.cursor = "pointer";
      if (event.features && event.features.length > 0) {
        if (hoveredStateId !== null) {
          map.setFeatureState(
            { source: "india-states-source", id: hoveredStateId },
            { hover: false }
          );
        }
        hoveredStateId = event.features[0].properties.id;
        if (hoveredStateId) {
          map.setFeatureState(
            { source: "india-states-source", id: hoveredStateId },
            { hover: true }
          );
        }
      }
    };
    const hoverOff = () => {
      map.getCanvas().style.cursor = "";
      if (hoveredStateId !== null) {
        map.setFeatureState(
          { source: "india-states-source", id: hoveredStateId },
          { hover: false }
        );
      }
      hoveredStateId = null;
    };

    map.on("click", "india-states-fill", clickHandler);
    map.on("mousemove", "india-states-fill", hoverOn);
    map.on("mouseleave", "india-states-fill", hoverOff);
    return () => {
      map.off("click", "india-states-fill", clickHandler);
      map.off("mousemove", "india-states-fill", hoverOn);
      map.off("mouseleave", "india-states-fill", hoverOff);
    };
  }, [mapReady, selectRegion]);

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
    </div>
  );
}

export default memo(forwardRef(MapEngine));
