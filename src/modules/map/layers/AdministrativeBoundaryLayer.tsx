import { useEffect } from "react"
import { addAdministrativeOverlay } from "@/modules/administrative"
import { useMapReady } from "../hooks/useMapReady"

interface AdministrativeBoundaryLayerProps {
	onReady?: () => void
}

export function AdministrativeBoundaryLayer({
	onReady,
}: AdministrativeBoundaryLayerProps) {
	const map = useMapReady()

	useEffect(() => {
		if (!map) return
		addAdministrativeOverlay(map)
		onReady?.()
	}, [map, onReady])

	return null
}
