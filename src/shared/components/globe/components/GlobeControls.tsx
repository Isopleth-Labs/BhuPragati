import type React from "react"
import { useEffect, useRef } from "react"
import * as THREE from "three"
import { applyCameraPosition } from "../utils/globe.camera"
import type { CountryEntry } from "../utils/globe.constants"
import {
	PINCH_ZOOM_SENSITIVITY,
	POINTER_SENSITIVITY,
	ZOOM_SENSITIVITY,
} from "../utils/globe.constants"
import { featureContains } from "../utils/globe.utils"

interface GlobeControlsProps {
	container: HTMLDivElement
	camera: THREE.PerspectiveCamera
	renderer: THREE.WebGLRenderer
	globeMesh: THREE.Mesh
	spherical: THREE.Spherical
	cameraTarget: THREE.Vector3
	rotateState: {
		isDragging: boolean
		lastX: number
		lastY: number
		inertiaX: number
		inertiaY: number
	}
	raycaster: THREE.Raycaster
	pointerNdc: THREE.Vector2
	countryEntriesRef: React.RefObject<CountryEntry[]>
	countriesReady: boolean
	hoveredCountry: CountryEntry | null
	setHoveredCountry: (entry: CountryEntry | null) => void
	selectedCountry: CountryEntry | null
	setSelectedCountry: (entry: CountryEntry | null) => void
	hideTooltip: () => void
}

export function GlobeControls({
	container,
	camera,
	renderer,
	globeMesh,
	spherical,
	cameraTarget,
	rotateState,
	raycaster,
	pointerNdc,
	countryEntriesRef,
	countriesReady,
	hoveredCountry,
	setHoveredCountry,
	setSelectedCountry,
	hideTooltip,
}: GlobeControlsProps) {
	const touchLastDistanceRef = useRef<number | undefined>(undefined)

	useEffect(() => {
		const onPointerDown = (event: MouseEvent | TouchEvent) => {
			rotateState.isDragging = true
			const clientX =
				"clientX" in event ? event.clientX : event.touches?.[0]?.clientX
			const clientY =
				"clientY" in event ? event.clientY : event.touches?.[0]?.clientY
			rotateState.lastX = clientX ?? 0
			rotateState.lastY = clientY ?? 0
		}

		const handleHover = (event: MouseEvent | TouchEvent) => {
			if (!countriesReady || !countryEntriesRef.current) return
			const clientX =
				"clientX" in event ? event.clientX : event.touches?.[0]?.clientX
			const clientY =
				"clientY" in event ? event.clientY : event.touches?.[0]?.clientY
			if (clientX == null || clientY == null) return

			const rect = renderer.domElement.getBoundingClientRect()
			pointerNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1
			pointerNdc.y = -((clientY - rect.top) / rect.height) * 2 + 1

			raycaster.setFromCamera(pointerNdc, camera)
			const hit = raycaster.intersectObject(globeMesh, true)[0]

			if (!hit) {
				setHoveredCountry(null)
				hideTooltip()
				container.style.cursor = "grab"
				return
			}

			const point = hit.point.clone().normalize()
			const latDeg = THREE.MathUtils.radToDeg(Math.asin(point.y))
			const lonDeg = THREE.MathUtils.radToDeg(Math.atan2(point.z, point.x))

			let found: CountryEntry | null = null
			for (const entry of countryEntriesRef.current) {
				if (featureContains(lonDeg, latDeg, entry.polygons, entry.bbox)) {
					found = entry
					break
				}
			}

			setHoveredCountry(found)
			if (found) {
				container.style.cursor = "pointer"
			} else {
				hideTooltip()
				container.style.cursor = "grab"
			}
		}

		const onPointerMove = (event: MouseEvent | TouchEvent) => {
			handleHover(event)
			if (!rotateState.isDragging) return

			const clientX =
				"clientX" in event ? event.clientX : event.touches?.[0]?.clientX
			const clientY =
				"clientY" in event ? event.clientY : event.touches?.[0]?.clientY

			const currentX = clientX ?? 0
			const currentY = clientY ?? 0

			const deltaX = (currentX - rotateState.lastX) * POINTER_SENSITIVITY
			const deltaY = (currentY - rotateState.lastY) * POINTER_SENSITIVITY

			spherical.theta -= deltaX
			spherical.phi -= deltaY
			rotateState.inertiaX = deltaX
			rotateState.inertiaY = deltaY
			rotateState.lastX = currentX
			rotateState.lastY = currentY

			applyCameraPosition(camera, spherical, cameraTarget)
		}

		const onPointerUp = () => {
			rotateState.isDragging = false
		}

		const onWheel = (event: WheelEvent) => {
			event.preventDefault()
			spherical.radius += event.deltaY * ZOOM_SENSITIVITY * spherical.radius
			applyCameraPosition(camera, spherical, cameraTarget)
		}

		const onTouchMove = (event: TouchEvent) => {
			if (event.touches.length === 1) {
				onPointerMove(event)
				return
			}
			if (event.touches.length === 2) {
				event.preventDefault()
				const [a, b] = event.touches
				const dx = a.clientX - b.clientX
				const dy = a.clientY - b.clientY
				const distance = Math.sqrt(dx * dx + dy * dy)
				if (touchLastDistanceRef.current !== undefined) {
					const delta = distance - touchLastDistanceRef.current
					spherical.radius -= delta * PINCH_ZOOM_SENSITIVITY
					applyCameraPosition(camera, spherical, cameraTarget)
				}
				touchLastDistanceRef.current = distance
			}
		}

		const onTouchEnd = () => {
			touchLastDistanceRef.current = undefined
			onPointerUp()
		}

		const onClick = () => {
			if (!hoveredCountry) {
				setSelectedCountry(null)
				hideTooltip()
				return
			}
			setSelectedCountry(hoveredCountry)
			console.log("[country-click]", {
				clickedName: hoveredCountry.name,
				featureIndex: hoveredCountry.featureIndex,
				featureId: hoveredCountry.featureId,
				polygonCount: hoveredCountry.polygons.length,
				borderUUID: hoveredCountry.line?.uuid,
				fillUUID: hoveredCountry.fill?.uuid,
			})
			const targetDir = hoveredCountry.centroidVec.clone().normalize()
			const cameraDist = camera.position.length()
			const newCamPos = targetDir.clone().multiplyScalar(cameraDist)
			camera.position.copy(newCamPos)
			camera.lookAt(cameraTarget)
		}

		// Attach listeners
		container.addEventListener("mousedown", onPointerDown)
		container.addEventListener("mousemove", onPointerMove)
		container.addEventListener("mouseup", onPointerUp)
		container.addEventListener("mouseleave", onPointerUp)
		container.addEventListener("wheel", onWheel, { passive: false })
		container.addEventListener("touchstart", onPointerDown, { passive: true })
		container.addEventListener("touchmove", onTouchMove, { passive: false })
		container.addEventListener("touchend", onTouchEnd)
		container.addEventListener("touchcancel", onTouchEnd)
		container.addEventListener("click", onClick)

		// Cleanup listeners
		return () => {
			container.removeEventListener("mousedown", onPointerDown)
			container.removeEventListener("mousemove", onPointerMove)
			container.removeEventListener("mouseup", onPointerUp)
			container.removeEventListener("mouseleave", onPointerUp)
			container.removeEventListener("wheel", onWheel)
			container.removeEventListener("touchstart", onPointerDown)
			container.removeEventListener("touchmove", onTouchMove)
			container.removeEventListener("touchend", onTouchEnd)
			container.removeEventListener("touchcancel", onTouchEnd)
			container.removeEventListener("click", onClick)
		}
	}, [
		container,
		camera,
		renderer,
		globeMesh,
		spherical,
		cameraTarget,
		rotateState,
		raycaster,
		pointerNdc,
		countryEntriesRef,
		countriesReady,
		hoveredCountry,
		setHoveredCountry,
		setSelectedCountry,
		hideTooltip,
	])

	return null
}
