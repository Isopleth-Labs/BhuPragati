import { Suspense, lazy } from "react";
import useActiveLayers from "../hooks/useActiveLayers.js";
import CommandPanel from "./panels/CommandPanel.jsx";
import InsightStrip from "./panels/InsightStrip.jsx";
import LegendPanel from "./panels/LegendPanel.jsx";
import TopBar from "./panels/TopBar.jsx";

// Lazy-load the map engine so the initial HUD paints fast and
// MapLibre + heavy GIS code splits into its own chunk.
const MapEngine = lazy(() => import("../features/map/MapEngine.jsx"));

export default function DashboardShell() {
  const { activeLayers, toggleLayer } = useActiveLayers();

  return (
    <main className="dashboard">
      <Suspense fallback={<div className="gis-map-shell" aria-hidden="true" />}>
        <MapEngine activeLayers={activeLayers} />
      </Suspense>

      <div className="dashboard__hud">
        <CommandPanel activeLayers={activeLayers} onToggleLayer={toggleLayer} />
        <TopBar />
        <LegendPanel />
        <InsightStrip />
      </div>
    </main>
  );
}
