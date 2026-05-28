import { useCallback, useMemo, useState } from "react";
import { infrastructureLayers } from "../config/layers";

// Default: all layers off so the map reads cleanly on first load.
// Users opt in to overlays from the left command panel.
function buildDefault() {
  return Object.fromEntries(infrastructureLayers.map((l) => [l.id, false]));
}

export default function useActiveLayers() {
  const defaults = useMemo(() => buildDefault(), []);
  const [activeLayers, setActiveLayers] = useState(defaults);

  const toggleLayer = useCallback((layerId) => {
    setActiveLayers((current) => ({ ...current, [layerId]: !current[layerId] }));
  }, []);

  const resetLayers = useCallback(() => {
    setActiveLayers(defaults);
  }, [defaults]);

  return { activeLayers, toggleLayer, resetLayers };
}
