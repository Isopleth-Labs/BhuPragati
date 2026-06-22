import { useEffect } from "react"
import type * as THREE from "three"
import {
	ATM_TARGET_OPACITY,
	BG_ROTATION_SPEED,
	BORDER_TARGET_OPACITY,
	CAMERA_LERP_FACTOR,
	CAMERA_LERP_THRESHOLD,
	CLOUD_TARGET_OPACITY,
	FADE_SPEED,
	SELECTED_PULSE_SPEED,
} from "../utils/globeviz.constants"

interface GlobeVizEffectsProps {
	camera: THREE.PerspectiveCamera
	backgroundGroup: THREE.Group
	globeMat: THREE.MeshPhysicalMaterial | null
	cloudMat: THREE.MeshPhongMaterial | null
	atmMat: THREE.MeshPhongMaterial | null
	starMat: THREE.ShaderMaterial | null
	borderMat: THREE.LineBasicMaterial | null
	selectedBorderMat: THREE.LineBasicMaterial | null
	assetsLoadedRef: React.MutableRefObject<boolean>
	fadeFactorRef: React.MutableRefObject<number>
	cameraTargetPosRef: React.MutableRefObject<THREE.Vector3 | null>
	addRenderCallback: (cb: () => void) => () => void
}

export function GlobeVizEffects({
	camera,
	backgroundGroup,
	globeMat,
	cloudMat,
	atmMat,
	starMat,
	borderMat,
	selectedBorderMat,
	assetsLoadedRef,
	fadeFactorRef,
	cameraTargetPosRef,
	addRenderCallback,
}: GlobeVizEffectsProps) {
	useEffect(() => {
		if (
			!globeMat ||
			!cloudMat ||
			!atmMat ||
			!starMat ||
			!borderMat ||
			!selectedBorderMat
		)
			return

		const remove = addRenderCallback(() => {
			const t = performance.now() / 1000

			// Pulse selected border
			selectedBorderMat.opacity = 0.5 + 0.5 * Math.sin(t * SELECTED_PULSE_SPEED)

			// Smooth camera rotation to country centroid
			if (cameraTargetPosRef.current) {
				camera.position.lerp(cameraTargetPosRef.current, CAMERA_LERP_FACTOR)
				if (
					camera.position.distanceTo(cameraTargetPosRef.current) <
					CAMERA_LERP_THRESHOLD
				) {
					cameraTargetPosRef.current = null
				}
			}

			// Smooth fade-in once assets are loaded
			if (assetsLoadedRef.current && fadeFactorRef.current < 1.0) {
				fadeFactorRef.current = Math.min(
					1.0,
					fadeFactorRef.current + FADE_SPEED,
				)
				const f = fadeFactorRef.current
				globeMat.opacity = f
				cloudMat.opacity = f * CLOUD_TARGET_OPACITY
				atmMat.opacity = f * ATM_TARGET_OPACITY
				borderMat.opacity = f * BORDER_TARGET_OPACITY
				starMat.uniforms.fade.value = f

				if (f >= 1.0) {
					globeMat.transparent = false
					globeMat.needsUpdate = true
				}
			}

			// Slowly rotate background starfield & Milky Way
			backgroundGroup.rotation.y = t * BG_ROTATION_SPEED

			// Update star twinkling shader time
			starMat.uniforms.time.value = t
		})

		return remove
	}, [
		camera,
		backgroundGroup,
		globeMat,
		cloudMat,
		atmMat,
		starMat,
		borderMat,
		selectedBorderMat,
		assetsLoadedRef,
		fadeFactorRef,
		cameraTargetPosRef,
		addRenderCallback,
	])

	return null
}
