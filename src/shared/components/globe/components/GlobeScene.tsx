import { useEffect } from "react"
import * as THREE from "three"
import {
	AMBIENT_LIGHT_COLOR,
	AMBIENT_LIGHT_INTENSITY,
	EARTH_TEXTURE_URL,
	STAR_COUNT,
	SUN_LIGHT_COLOR,
	SUN_LIGHT_INTENSITY,
	SUN_LIGHT_POSITION,
} from "../utils/globe.constants"

interface GlobeSceneProps {
	scene: THREE.Scene
	renderer: THREE.WebGLRenderer
	globeMesh: THREE.Mesh
	globeMaterial: THREE.MeshStandardMaterial
}

export function GlobeScene({
	scene,
	renderer,
	globeMesh,
	globeMaterial,
}: GlobeSceneProps) {
	useEffect(() => {
		// 1. Setup lights
		const ambientLight = new THREE.AmbientLight(
			AMBIENT_LIGHT_COLOR,
			AMBIENT_LIGHT_INTENSITY,
		)
		scene.add(ambientLight)

		const sunLight = new THREE.DirectionalLight(
			SUN_LIGHT_COLOR,
			SUN_LIGHT_INTENSITY,
		)
		sunLight.position.set(
			SUN_LIGHT_POSITION.x,
			SUN_LIGHT_POSITION.y,
			SUN_LIGHT_POSITION.z,
		)
		scene.add(sunLight)

		// 2. Setup starfield points
		const starGeometry = new THREE.BufferGeometry()
		const starVertices = new Float32Array(STAR_COUNT * 3)
		for (let i = 0; i < STAR_COUNT; i += 1) {
			const radius = 45 + Math.random() * 35
			const theta = Math.random() * Math.PI * 2
			const phi = Math.acos(Math.random() * 2 - 1)
			const x = radius * Math.sin(phi) * Math.cos(theta)
			const y = radius * Math.cos(phi)
			const z = radius * Math.sin(phi) * Math.sin(theta)
			starVertices[i * 3] = x
			starVertices[i * 3 + 1] = y
			starVertices[i * 3 + 2] = z
		}
		starGeometry.setAttribute(
			"position",
			new THREE.BufferAttribute(starVertices, 3),
		)
		const starMaterial = new THREE.PointsMaterial({
			color: 0xffffff,
			size: 0.05,
			transparent: true,
			opacity: 0.88,
			depthWrite: false,
			blending: THREE.AdditiveBlending,
		})
		const stars = new THREE.Points(starGeometry, starMaterial)
		scene.add(stars)

		// 3. Asynchronously load textures
		const loader = new THREE.TextureLoader()
		let loadedTexture: THREE.Texture | null = null

		loader.load(
			EARTH_TEXTURE_URL,
			(texture) => {
				texture.colorSpace = THREE.SRGBColorSpace
				texture.anisotropy = renderer.capabilities.getMaxAnisotropy()
				globeMaterial.map = texture
				globeMaterial.needsUpdate = true
				loadedTexture = texture
				console.log("[earth-texture] loaded", {
					mapPresent: true,
					material: {
						color: globeMaterial.color.getHexString(),
						roughness: globeMaterial.roughness,
						metalness: globeMaterial.metalness,
						emissive: globeMaterial.emissive.getHexString(),
						emissiveIntensity: globeMaterial.emissiveIntensity,
						visible: globeMesh.visible,
					},
					anisotropy: texture.anisotropy,
					colorSpace: texture.colorSpace,
				})
			},
			undefined,
			(error) => {
				console.error("[EarthViewer] day texture failed to load", error)
			},
		)

		// Cleanup on unmount
		return () => {
			scene.remove(ambientLight)
			scene.remove(sunLight)
			scene.remove(stars)

			starGeometry.dispose()
			starMaterial.dispose()

			if (loadedTexture) {
				loadedTexture.dispose()
				globeMaterial.map = null
				globeMaterial.needsUpdate = true
			}
		}
	}, [scene, renderer, globeMesh, globeMaterial])

	return null
}
