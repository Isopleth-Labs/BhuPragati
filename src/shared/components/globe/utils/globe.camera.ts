import * as THREE from "three"
import { MAX_RADIUS, MIN_RADIUS } from "./globe.constants"

/**
 * Updates camera position from the spherical coordinates, enforcing clamps.
 */
export function applyCameraPosition(
	camera: THREE.PerspectiveCamera,
	spherical: THREE.Spherical,
	cameraTarget: THREE.Vector3,
) {
	spherical.radius = THREE.MathUtils.clamp(
		spherical.radius,
		MIN_RADIUS,
		MAX_RADIUS,
	)
	spherical.phi = THREE.MathUtils.clamp(spherical.phi, 0.25, Math.PI - 0.22)
	const newPos = new THREE.Vector3().setFromSpherical(spherical)
	camera.position.copy(newPos)
	camera.lookAt(cameraTarget)
}
