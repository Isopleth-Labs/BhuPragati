import { useEffect } from "react"
import { useMapReady } from "../hooks/useMapReady"
import { updateChoroplethForIndicator } from "../layers/StateBoundaryLayer"

interface ChoroplethUpdateControllerProps {
	activeIndicator: string
	ready: boolean
}

// Syncs choropleth fill colors when activeIndicator changes.
// StateBoundaryLayer initializes with "overall" on mount; this controller
// handles all subsequent indicator changes without touching StateBoundaryLayer.
export function ChoroplethUpdateController({
	activeIndicator,
	ready,
}: ChoroplethUpdateControllerProps) {
	const map = useMapReady()

	useEffect(() => {
		if (!map || !ready) return
		updateChoroplethForIndicator(map, activeIndicator)
	}, [map, ready, activeIndicator])

	return null
}
