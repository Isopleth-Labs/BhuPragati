import { createFileRoute } from "@tanstack/react-router"
import DashboardShell from "#/shared/components/DashboardShell"

export const Route = createFileRoute("/map")({
	component: MapPage,
})

function MapPage() {
	return <DashboardShell />
}
