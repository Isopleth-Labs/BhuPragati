import { useEffect, useRef } from "react"
import { startFocusPulse } from "../animation/focusPulse"
import { useMapReady } from "../hooks/useMapReady"

interface FocusPulseControllerProps {
	// Gated on InfrastructureLayer — the pulsed layer ids (flood/road/
	// electricity glows) only exist once those overlays are loaded.
	ready: boolean
}

export function FocusPulseController({ ready }: FocusPulseControllerProps) {
	const map = useMapReady()
	const stopRef = useRef<() => void>(() => {})

	useEffect(() => {
		if (!map || !ready) return
		stopRef.current = startFocusPulse(map)
		return () => stopRef.current()
	}, [map, ready])

	return null
}
