import { memo, useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  FOCUS_EASE,
  INITIAL_VIEW_STATE,
  MAP_FIT_BOUNDS,
  MAP_MAX_BOUNDS,
  MAP_STYLE_URL,
  MAP_ZOOM_LIMITS,
} from "../../config/mapConfig";
import { infrastructureLayers } from "../../config/layers";
import { addBasemapOverlay } from "./overlays/basemap";
import { addAdministrativeOverlay } from "./overlays/administrative";
import { addCommandCenterOverlay } from "./overlays/commandCenter";
import { applyTacticalSky, tuneMapLabels } from "./overlays/labels";
import { softenIntelligenceLayers } from "./overlays/intelligence";
import { addOsmOverlays } from "./overlays/osm";
import { loadHeavyOverlays } from "./overlays";
import { startFocusPulse } from "./animation/focusPulse";
import { attachInteractivePopups } from "./interactions/popup";
import { getFitPadding } from "./utils";

function MapEngine({ activeLayers }) {
  const mapNodeRef = useRef(null);
  const mapRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);

  // Map lifecycle: create once, dispose on unmount.
  useEffect(() => {
    if (!mapNodeRef.current || mapRef.current) return undefined;

    let stopAnimation = () => {};
    let cancelled = false;

    const map = new maplibregl.Map({
      container: mapNodeRef.current,
      style: MAP_STYLE_URL,
      ...INITIAL_VIEW_STATE,
      maxBounds: MAP_MAX_BOUNDS,
      minZoom: MAP_ZOOM_LIMITS.min,
      maxZoom: MAP_ZOOM_LIMITS.max,
      antialias: true,
      attributionControl: false,
    });

    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "top-right");
    map.addControl(new maplibregl.ScaleControl({ unit: "metric" }), "bottom-right");
    map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");

    const resizeObserver = new ResizeObserver(() => map.resize());
    resizeObserver.observe(mapNodeRef.current);

    map.on("load", async () => {
      applyTacticalSky(map);
      addBasemapOverlay(map);
      tuneMapLabels(map);

      // Live OSM intelligence (roads + settlements) — async, non-blocking.
      addOsmOverlays(map).catch((err) => console.warn("[osm] failed:", err));

      addAdministrativeOverlay(map);

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

      // Command center overlay sits on top of infrastructure layers.
      addCommandCenterOverlay(map);

      map.fitBounds(MAP_FIT_BOUNDS, {
        padding: getFitPadding(mapNodeRef.current),
        duration: 0,
      });

      map.easeTo({
        center: FOCUS_EASE.center,
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
  }, []);

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

  return (
    <div className="gis-map-shell" aria-label="Interactive GIS map of Kusheshwar Asthan">
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

export default memo(MapEngine);
