import type * as THREE from "three"
import type { CountryEntry } from "../../utils/globe.constants"
import { EARTH_RADIUS, LABEL_OFFSET } from "../../utils/globe.constants"

export function updateTooltipPosition(
	camera: THREE.PerspectiveCamera,
	renderer: THREE.WebGLRenderer,
	tooltip: HTMLDivElement,
	selectedCountry: CountryEntry | null,
): void {
	if (!selectedCountry) {
		tooltip.style.opacity = "0"
		return
	}
	const camDir = camera.position.clone().normalize()
	const centroidDir = selectedCountry.centroidVec.clone().normalize()
	const facing = centroidDir.dot(camDir) > 0.0
	if (!facing) {
		tooltip.style.opacity = "0"
		return
	}
	const worldPos = centroidDir
		.clone()
		.multiplyScalar(EARTH_RADIUS * LABEL_OFFSET)
	const projected = worldPos.project(camera)
	const rect = renderer.domElement.getBoundingClientRect()
	const x = (projected.x * 0.5 + 0.5) * rect.width + rect.left
	const y = (-projected.y * 0.5 + 0.5) * rect.height + rect.top

	tooltip.textContent = selectedCountry.name
	tooltip.style.opacity = "1"
	tooltip.style.left = `${x + 10}px`
	tooltip.style.top = `${y + 10}px`
}
