import type * as THREE from "three"
import type { CountryEntry } from "../../utils/globe.constants"

export function updateCountryVisibility(
	camera: THREE.PerspectiveCamera,
	countryEntries: CountryEntry[],
): void {
	const camDir = camera.position.clone().normalize()
	countryEntries.forEach((entry) => {
		const centroidDir = entry.centroidVec.clone().normalize()
		const facing = centroidDir.dot(camDir) > 0.0
		const visible = facing
		if (entry.line) entry.line.visible = visible
		if (entry.fill) entry.fill.visible = visible
	})
}
