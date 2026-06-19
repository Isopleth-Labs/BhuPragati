import type { Map as MaplibreMap } from "maplibre-gl"
import { useEffect, useRef } from "react"
import { infrastructureLayers } from "@/shared/lib/config/layers"
import { useMapReady } from "../hooks/useMapReady"
import { loadHeavyOverlays } from "../overlays"

interface InfrastructureLayerProps {
	activeLayers: Record<string, boolean>
	onReady?: () => void
}

function applyVisibility(
	map: MaplibreMap,
	activeLayers: Record<string, boolean>,
) {
	infrastructureLayers.forEach((layer) => {
		const visibility = activeLayers[layer.id] ? "visible" : "none"
		layer.mapLayerIds.forEach((layerId) => {
			if (map.getLayer(layerId)) {
				map.setLayoutProperty(layerId, "visibility", visibility)
			}
		})
	})
}

export function InfrastructureLayer({
	activeLayers,
	onReady,
}: InfrastructureLayerProps) {
	const map = useMapReady()
	const loadedRef = useRef(false)
	const activeLayersRef = useRef(activeLayers)
	activeLayersRef.current = activeLayers

	// Load the 9 heavy overlay modules once per map instance.
	useEffect(() => {
		if (!map || loadedRef.current) return
		loadedRef.current = true
		let cancelled = false

		loadHeavyOverlays(map).then(() => {
			if (cancelled) return
			applyVisibility(map, activeLayersRef.current)
			onReady?.()
		})

		return () => {
			cancelled = true
		}
	}, [map, onReady])

	// Visibility sync on activeLayers change, after the initial load.
	useEffect(() => {
		if (!map || !loadedRef.current) return
		applyVisibility(map, activeLayers)
	}, [map, activeLayers])

	return null
}
