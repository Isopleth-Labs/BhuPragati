import * as THREE from "three"
import type { Polygon } from "../../utils/globe.constants"
import { BORDER_OFFSET, EARTH_RADIUS } from "../../utils/globe.constants"
import { buildBorderGeometry, buildFillGeometry } from "../../utils/globe.utils"

export function createCountryLine(
	polygons: Polygon[][],
	name: string,
	material: THREE.LineBasicMaterial,
): THREE.LineSegments {
	const borderGeometry = buildBorderGeometry(
		polygons,
		EARTH_RADIUS * BORDER_OFFSET,
	)
	const line = new THREE.LineSegments(borderGeometry, material)
	line.name = `border:${name}`
	line.renderOrder = 3
	return line
}

export function createCountryFill(
	polygons: Polygon[][],
	name: string,
	material: THREE.MeshBasicMaterial,
): THREE.Mesh | null {
	const fillGeometry = buildFillGeometry(polygons, EARTH_RADIUS * BORDER_OFFSET)
	if (!fillGeometry) return null
	const fill = new THREE.Mesh(fillGeometry, material)
	fill.name = `fill:${name}`
	fill.renderOrder = 2
	return fill
}
