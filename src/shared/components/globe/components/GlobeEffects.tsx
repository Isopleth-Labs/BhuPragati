import { useEffect } from "react"
import type * as THREE from "three"
import { applyCameraPosition } from "../utils/globe.camera"
import { DAMPING, INERTIA_THRESHOLD } from "../utils/globe.constants"

interface GlobeEffectsProps {
	camera: THREE.PerspectiveCamera
	spherical: THREE.Spherical
	cameraTarget: THREE.Vector3
	rotateState: {
		isDragging: boolean
		lastX: number
		lastY: number
		inertiaX: number
		inertiaY: number
	}
	addRenderCallback: (cb: () => void) => () => void
}

export function GlobeEffects({
	camera,
	spherical,
	cameraTarget,
	rotateState,
	addRenderCallback,
}: GlobeEffectsProps) {
	useEffect(() => {
		const onFrameTick = () => {
			if (!rotateState.isDragging) {
				spherical.theta -= rotateState.inertiaX
				spherical.phi -= rotateState.inertiaY
				rotateState.inertiaX *= DAMPING
				rotateState.inertiaY *= DAMPING
				if (
					Math.abs(rotateState.inertiaX) > INERTIA_THRESHOLD ||
					Math.abs(rotateState.inertiaY) > INERTIA_THRESHOLD
				) {
					applyCameraPosition(camera, spherical, cameraTarget)
				}
			}
		}

		// Register the tick with EarthViewer's render loop
		const cleanupRenderCallback = addRenderCallback(onFrameTick)

		return () => {
			cleanupRenderCallback()
		}
	}, [addRenderCallback, camera, spherical, cameraTarget, rotateState])

	return null
}
