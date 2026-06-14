import DashboardShell from "#/shared/components/DashboardShell";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/map")({
	component: MapPage,
});

function MapPage() {
	return <DashboardShell />;
}
