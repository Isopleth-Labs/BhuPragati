import { useMemo, useState } from "react";
import { infrastructureLayers } from "../data/infrastructureLayers";
import InfrastructureMap from "./map/InfrastructureMap";
import CommandPanel from "./panels/CommandPanel";
import InsightStrip from "./panels/InsightStrip";
import LayerPanel from "./panels/LayerPanel";
import TopBar from "./panels/TopBar";

function createDefaultLayerState() {
  return Object.fromEntries(infrastructureLayers.map((layer) => [layer.id, true]));
}

export default function DashboardShell() {
  const defaultLayerState = useMemo(() => createDefaultLayerState(), []);
  const [activeLayers, setActiveLayers] = useState(defaultLayerState);

  const toggleLayer = (layerId) => {
    setActiveLayers((current) => ({
      ...current,
      [layerId]: !current[layerId],
    }));
  };

  const resetLayers = () => {
    setActiveLayers(defaultLayerState);
  };

  return (
    <main className="dashboard">
      <InfrastructureMap activeLayers={activeLayers} />

      <div className="dashboard__hud">
        <TopBar />
        <CommandPanel />
        <LayerPanel
          activeLayers={activeLayers}
          onToggleLayer={toggleLayer}
          onResetLayers={resetLayers}
        />
        <InsightStrip />
      </div>
    </main>
  );
}
