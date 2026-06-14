import {
  memo,
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import maplibregl, { type Map as MapLibreMap } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  FOCUS_EASE,
  INITIAL_VIEW_STATE,
  MAP_FIT_BOUNDS,
  MAP_MAX_BOUNDS,
  MAP_STYLE_URL,
  MAP_ZOOM_LIMITS,
} from "@/shared/lib/config/mapConfig";
import type { MapEngineHandles } from "@/shared/types";
import { infrastructureLayers } from "@/shared/lib/config/layers";
import { addBasemapOverlay } from "./overlays/basemap";
import { addAdministrativeOverlay } from "@/modules/administrative";
import { addCommandCenterOverlay } from "#/modules/command-center";
import { applyTacticalSky, tuneMapLabels } from "./overlays/labels";
import { softenIntelligenceLayers } from "./overlays/intelligence";
import { addOsmOverlays } from "./overlays/osm";
import { loadHeavyOverlays } from "./overlays";
import { startFocusPulse } from "./animation/focusPulse";
import { attachInteractivePopups } from "./interactions/popup";
import { getFitPadding } from "#/shared/lib/utils/utils";

const MapEngine = forwardRef<
  MapEngineHandles | null,
  { activeLayers: Record<string, boolean> }
>(({ activeLayers }, ref) => {
  const mapNodeRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const [mapReady, setMapReady] = useState(false);

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
      maxBounds: MAP_MAX_BOUNDS as [[number, number], [number, number]],
      minZoom: MAP_ZOOM_LIMITS.min,
      maxZoom: MAP_ZOOM_LIMITS.max,
      attributionControl: false,
    });

    mapRef.current = map;
    map.addControl(
      new maplibregl.NavigationControl({ visualizePitch: true }),
      "top-right",
    );
    map.addControl(
      new maplibregl.ScaleControl({ unit: "metric" }),
      "bottom-right",
    );
    map.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      "bottom-right",
    );

    const resizeObserver = new ResizeObserver(() => map.resize());
    resizeObserver.observe(mapNodeRef.current);

    map.on("load", async () => {
      applyTacticalSky(map);
      addBasemapOverlay(map);
      tuneMapLabels(map);

      addOsmOverlays(map).catch((err) => console.warn("[osm] failed:", err));
      addAdministrativeOverlay(map);

      await loadHeavyOverlays(map);
      if (cancelled) return;

      softenIntelligenceLayers(map);

      infrastructureLayers.forEach((layer) => {
        const visibility = activeLayers[layer.id] ? "visible" : "none";
        layer.mapLayerIds.forEach((layerId) => {
          if (map.getLayer(layerId)) {
            map.setLayoutProperty(layerId, "visibility", visibility);
          }
        });
      });

      addCommandCenterOverlay(map);

      map.fitBounds(MAP_FIT_BOUNDS as [[number, number], [number, number]], {
        padding: getFitPadding(mapNodeRef.current),
        duration: 0,
      });

      map.easeTo({
        center: FOCUS_EASE.center as [number, number],
        zoom: FOCUS_EASE.zoom,
        pitch: INITIAL_VIEW_STATE.pitch,
        bearing: INITIAL_VIEW_STATE.bearing,
        duration: FOCUS_EASE.duration,
      });

      stopAnimation = startFocusPulse(map);
      attachInteractivePopups(map);
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
  }, [activeLayers]);

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
        if (map.getLayer(lid))
          map.setLayoutProperty(lid, "visibility", "visible");
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

  return (
    <div className="gis-map-shell">
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
});

export default memo(MapEngine);
