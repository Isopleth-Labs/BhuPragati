import { useEffect } from "react"
import * as THREE from "three"
import type { GlobeVizCountryEntry } from "../utils/globeviz.constants"
import { CLICK_DISTANCE_THRESHOLD } from "../utils/globeviz.constants"
import { featureContains } from "../utils/globeviz.math"

interface GlobeVizControlsProps {
	container: HTMLDivElement
	camera: THREE.PerspectiveCamera
	renderer: THREE.WebGLRenderer
	globeMesh: THREE.Mesh
	globeGroup: THREE.Group
	countryEntries: GlobeVizCountryEntry[]
	tooltip: HTMLDivElement
	onCountryClick: (name: string | null) => void
	onHoverChange: (name: string | null) => void
	hoveredCountryName: string | null
	selectedEntryRef: React.MutableRefObject<GlobeVizCountryEntry | null>
	borderMat: THREE.LineBasicMaterial
	hoverBorderMat: THREE.LineBasicMaterial
	onCameraTargetClear: () => void
}

export function GlobeVizControls({
	container,
	camera,
	renderer,
	globeMesh,
	globeGroup,
	countryEntries,
	tooltip,
	onCountryClick,
	onHoverChange,
	hoveredCountryName,
	selectedEntryRef,
	borderMat,
	hoverBorderMat,
	onCameraTargetClear,
}: GlobeVizControlsProps) {
	useEffect(() => {
		const raycaster = new THREE.Raycaster()
		const pointerNdc = new THREE.Vector2()

		function hitTestCountry(event: PointerEvent | MouseEvent): string | null {
			if (!countryEntries.length) return null
			const rect = renderer.domElement.getBoundingClientRect()
			pointerNdc.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
			pointerNdc.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
			raycaster.setFromCamera(pointerNdc, camera)

			const hits = raycaster.intersectObject(globeMesh, false)
			if (!hits.length) return null

			const localPoint = globeGroup.worldToLocal(hits[0].point.clone())
			const norm = localPoint.normalize()
			const hitLat = THREE.MathUtils.radToDeg(Math.asin(norm.y))
			const hitLon = THREE.MathUtils.radToDeg(Math.atan2(norm.z, -norm.x)) - 180
			const normLon = ((hitLon + 540) % 360) - 180

			for (const entry of countryEntries) {
				if (featureContains(normLon, hitLat, entry.coordinates, entry.type)) {
					return entry.name
				}
			}
			return null
		}

		// ── Hover handler (throttled via rAF) ──
		let hoverRafPending = false
		let lastMoveEvent: PointerEvent | null = null

		function onPointerMove(event: PointerEvent) {
			lastMoveEvent = event
			if (hoverRafPending) return
			hoverRafPending = true
			requestAnimationFrame(() => {
				hoverRafPending = false
				const evt = lastMoveEvent
				if (!evt) return
				const name = hitTestCountry(evt)
				if (name !== hoveredCountryName) {
					// Deselect old hover
					if (hoveredCountryName) {
						const oldEntry = countryEntries.find(
							(e) => e.name === hoveredCountryName,
						)
						if (oldEntry && oldEntry !== selectedEntryRef.current) {
							oldEntry.borderMeshes.forEach((m) => {
								m.material = borderMat
							})
						}
					}

					onHoverChange(name)

					if (name) {
						const newEntry = countryEntries.find((e) => e.name === name)
						if (newEntry && newEntry !== selectedEntryRef.current) {
							newEntry.borderMeshes.forEach((m) => {
								m.material = hoverBorderMat
							})
						}
						tooltip.textContent = name
						tooltip.style.opacity = "1"
						container.style.cursor = "pointer"
					} else {
						tooltip.style.opacity = "0"
						container.style.cursor = "grab"
					}
				}
				// Always update position when visible
				if (hoveredCountryName) {
					tooltip.style.left = `${evt.clientX + 14}px`
					tooltip.style.top = `${evt.clientY + 14}px`
				}
			})
		}

		// ── Click handler (distance check to distinguish from drag) ──
		let pointerDownPos: { x: number; y: number } | null = null

		function onPointerDown(event: PointerEvent) {
			pointerDownPos = { x: event.clientX, y: event.clientY }
			onCameraTargetClear()
		}

		function onPointerUp(event: PointerEvent) {
			if (!pointerDownPos) return
			const dx = event.clientX - pointerDownPos.x
			const dy = event.clientY - pointerDownPos.y
			const dist = Math.sqrt(dx * dx + dy * dy)
			if (dist < CLICK_DISTANCE_THRESHOLD) {
				const name = hitTestCountry(event)
				onCountryClick(name)
			}
			pointerDownPos = null
		}

		container.addEventListener("pointerdown", onPointerDown)
		container.addEventListener("pointerup", onPointerUp)
		container.addEventListener("pointermove", onPointerMove)

		return () => {
			container.removeEventListener("pointerdown", onPointerDown)
			container.removeEventListener("pointerup", onPointerUp)
			container.removeEventListener("pointermove", onPointerMove)
		}
	}, [
		container,
		camera,
		renderer,
		globeMesh,
		globeGroup,
		countryEntries,
		tooltip,
		onCountryClick,
		onHoverChange,
		hoveredCountryName,
		selectedEntryRef,
		borderMat,
		hoverBorderMat,
		onCameraTargetClear,
	])

	return null
}
