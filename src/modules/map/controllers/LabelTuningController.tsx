import { useEffect } from "react"
import { useMapReady } from "../hooks/useMapReady"
import { applyTacticalSky, tuneMapLabels } from "../overlays/labels"

export function LabelTuningController() {
	const map = useMapReady()

	useEffect(() => {
		if (!map) return
		applyTacticalSky(map)
		tuneMapLabels(map)
	}, [map])

	return null
}
