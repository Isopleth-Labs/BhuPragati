import type { MapLibreMap } from "maplibre-gl"
import {
	STATE_FILL_LAYER,
	STATE_FILL_SOURCE,
	STATE_LABEL_SOURCE,
} from "@/shared/selectors"
import { stateIdToNumericId } from "../layers/StateBoundaryLayer"

export function stateSelectorPlugin(
	map: MapLibreMap,
	onStateClick: (stateId: string) => void,
) {
	let lastHovered: number | null = null

	const canvas = map.getCanvas()

	const clearHover = () => {
		if (lastHovered === null) return

		map.setFeatureState(
			{ source: STATE_FILL_SOURCE, id: lastHovered },
			{ hover: false },
		)

		map.setFeatureState(
			{ source: STATE_LABEL_SOURCE, id: lastHovered },
			{ hover: false },
		)

		lastHovered = null
	}

	const handleMouseMove = (e: any) => {
		if (!e.features?.length) return

		const id = e.features[0].properties?.id
		if (!id) return

		const numericId = stateIdToNumericId[id]
		if (!numericId) return

		canvas.style.cursor = "pointer"

		if (numericId === lastHovered) return

		clearHover()

		map.setFeatureState(
			{ source: STATE_FILL_SOURCE, id: numericId },
			{ hover: true },
		)

		map.setFeatureState(
			{ source: STATE_LABEL_SOURCE, id: numericId },
			{ hover: true },
		)

		lastHovered = numericId
	}

	const handleMouseLeave = () => {
		canvas.style.cursor = ""
		clearHover()
	}

	const handleClick = (e: any) => {
		if (!e.features?.length) return

		const id = e.features[0].properties?.id
		if (id) onStateClick(id)
	}

	map.on("mousemove", STATE_FILL_LAYER, handleMouseMove)
	map.on("mouseleave", STATE_FILL_LAYER, handleMouseLeave)
	map.on("click", STATE_FILL_LAYER, handleClick)

	// cleanup
	return () => {
		map.off("mousemove", STATE_FILL_LAYER, handleMouseMove)
		map.off("mouseleave", STATE_FILL_LAYER, handleMouseLeave)
		map.off("click", STATE_FILL_LAYER, handleClick)

		canvas.style.cursor = ""
		lastHovered = null
	}
}
