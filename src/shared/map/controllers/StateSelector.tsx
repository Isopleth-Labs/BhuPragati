import type { MapLayerMouseEvent } from "maplibre-gl"
import { useEffect, useRef } from "react"
import {
	STATE_FILL_LAYER,
	STATE_FILL_SOURCE,
	STATE_LABEL_SOURCE,
} from "@/shared/selectors"
import { useMapReady } from "../hooks/useMapReady"
import { stateIdToNumericId } from "../layers/StateBoundaryLayer"

interface StateSelectorProps {
	ready: boolean
	onStateClick: (stateId: string) => void
}

// Handles hover + click interaction for india-states-fill.
// Emits stateId via callback only — owns zero navigation, routing, or region state.
// Cursor, feature-state.hover, and onStateClick emission are its entire surface.
//
// Pattern reused by future DistrictSelectionController (on district-lines)
// and BlockSelectionController — each controller owns one level, emits one ID.
export function StateSelector({
	ready,
	onStateClick,
}: StateSelectorProps) {
	const map = useMapReady()
	const lastHoveredRef = useRef<number | null>(null)

	// Stable ref so onStateClick identity changes don't re-run the listener effect.
	// Listeners are registered once when [map, ready] settle; the ref is always current.
	const onStateClickRef = useRef<(stateId: string) => void>(onStateClick)
	useEffect(() => {
		onStateClickRef.current = onStateClick
	}, [onStateClick])

	useEffect(() => {
		if (!map || !ready) return

		// Bind to non-null local — TypeScript can't narrow `map` through closure
		// boundaries even after the null check above.
		const m = map
		const canvas = m.getCanvas()

		function clearHover() {
			if (lastHoveredRef.current !== null) {
				m.setFeatureState(
					{ source: STATE_FILL_SOURCE, id: lastHoveredRef.current },
					{ hover: false },
				)
				m.setFeatureState(
					{ source: STATE_LABEL_SOURCE, id: lastHoveredRef.current },
					{ hover: false },
				)
				lastHoveredRef.current = null
			}
		}

		function handleMouseMove(e: MapLayerMouseEvent) {
			if (!e.features?.length) return
			const id = (e.features[0].properties as { id?: string }).id
			if (!id) return
			const numericId = stateIdToNumericId[id]
			if (!numericId) return

			canvas.style.cursor = "pointer"

			if (numericId === lastHoveredRef.current) return

			clearHover()

			m.setFeatureState(
				{ source: STATE_FILL_SOURCE, id: numericId },
				{ hover: true },
			)
			m.setFeatureState(
				{ source: STATE_LABEL_SOURCE, id: numericId },
				{ hover: true },
			)
			lastHoveredRef.current = numericId
		}

		function handleMouseLeave() {
			canvas.style.cursor = ""
			clearHover()
		}

		function handleClick(e: MapLayerMouseEvent) {
			if (!e.features?.length) return
			const id = (e.features[0].properties as { id?: string }).id
			if (id) onStateClickRef.current(id)
		}

		m.on("mousemove", STATE_FILL_LAYER, handleMouseMove)
		m.on("mouseleave", STATE_FILL_LAYER, handleMouseLeave)
		m.on("click", STATE_FILL_LAYER, handleClick)

		return () => {
			m.off("mousemove", STATE_FILL_LAYER, handleMouseMove)
			m.off("mouseleave", STATE_FILL_LAYER, handleMouseLeave)
			m.off("click", STATE_FILL_LAYER, handleClick)
			canvas.style.cursor = ""
			lastHoveredRef.current = null
		}
	}, [map, ready])

	return null
}
