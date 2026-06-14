import { Suspense, lazy } from "react";
import useActiveLayers from "@/shared/hooks/useActiveLayers";
import CommandPanel from "./panels/CommandPanel";
import InsightStrip from "./panels/InsightStrip";
import LegendPanel from "./panels/LegendPanel";
import TopBar from "./panels/TopBar";

// Lazy-load the map engine so the initial HUD paints fast and
// MapLibre + heavy GIS code splits into its own chunk.
const MapEngine = lazy(() => import("@/modules/map"));

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
