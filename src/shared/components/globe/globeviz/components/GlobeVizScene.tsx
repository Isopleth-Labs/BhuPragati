import { useEffect } from "react"
import * as THREE from "three"
import {
	ATM_COLOR,
	ATM_RADIUS_SCALE,
	CLOUD_RADIUS_SCALE,
	GLOBE_BUMP_SCALE,
	GLOBE_CLEARCOAT,
	GLOBE_CLEARCOAT_ROUGHNESS,
	GLOBE_COLOR,
	GLOBE_EMISSIVE,
	GLOBE_EMISSIVE_INTENSITY,
	GLOBE_METALNESS,
	GLOBE_RADIUS,
	GLOBE_ROUGHNESS,
	GLOBE_SEGMENTS,
	HEMI_GROUND_COLOR,
	HEMI_INTENSITY,
	HEMI_SKY_COLOR,
	MW_COLOR,
	MW_OPACITY,
	MW_RADIUS,
	MW_ROTATION_X,
	MW_SEGMENTS,
	STAR_ANCHOR_COUNT,
	STAR_ANCHOR_MIN_RADIUS,
	STAR_ANCHOR_RADIUS_RANGE,
	STAR_COUNT,
	STAR_FRAGMENT_SHADER,
	STAR_MIN_RADIUS,
	STAR_RADIUS_RANGE,
	STAR_VERTEX_SHADER,
	SUN_COLOR,
	SUN_INTENSITY,
	SUN_POSITION,
	TEX_BUMP,
	TEX_CLOUD,
	TEX_DAY,
	TEX_MILKY_WAY,
	TEX_NIGHT,
	TEX_SPEC,
} from "../utils/globeviz.constants"

interface GlobeVizSceneProps {
	scene: THREE.Scene
	renderer: THREE.WebGLRenderer
	globeGroup: THREE.Group
	backgroundGroup: THREE.Group
	onSceneReady: (refs: {
		globeMesh: THREE.Mesh
		globeMat: THREE.MeshPhysicalMaterial
		cloudMat: THREE.MeshPhongMaterial
		atmMat: THREE.MeshPhongMaterial
		starMat: THREE.ShaderMaterial
		borderMat: THREE.LineBasicMaterial
		globeGeo: THREE.SphereGeometry
		cloudGeo: THREE.SphereGeometry
		atmGeo: THREE.SphereGeometry
		starGeo: THREE.BufferGeometry
		mwGeo: THREE.SphereGeometry
		mwMat: THREE.MeshBasicMaterial
	}) => void
	onTexturesLoaded: () => void
}

export function GlobeVizScene({
	scene,
	renderer,
	globeGroup,
	backgroundGroup,
	onSceneReady,
	onTexturesLoaded,
}: GlobeVizSceneProps) {
	useEffect(() => {
		// ── Lighting ──
		const hemiLight = new THREE.HemisphereLight(
			HEMI_SKY_COLOR,
			HEMI_GROUND_COLOR,
			HEMI_INTENSITY,
		)
		scene.add(hemiLight)

		const sun = new THREE.DirectionalLight(SUN_COLOR, SUN_INTENSITY)
		sun.position.copy(SUN_POSITION)
		scene.add(sun)

		// ── Texture loading ──
		const loadingManager = new THREE.LoadingManager()
		loadingManager.onLoad = () => {
			onTexturesLoaded()
		}

		const loader = new THREE.TextureLoader(loadingManager)
		const maxAniso = renderer.capabilities.getMaxAnisotropy()

		function loadTex(path: string, colorSpace: THREE.ColorSpace | null = null) {
			const t = loader.load(path)
			t.anisotropy = maxAniso
			t.minFilter = THREE.LinearMipmapLinearFilter
			t.magFilter = THREE.LinearFilter
			t.generateMipmaps = true
			if (colorSpace) t.colorSpace = colorSpace
			return t
		}

		const dayTex = loadTex(TEX_DAY, THREE.SRGBColorSpace)
		const bumpTex = loadTex(TEX_BUMP)
		const specTex = loadTex(TEX_SPEC)
		const cloudTex = loadTex(TEX_CLOUD, THREE.SRGBColorSpace)
		const milkyWayTex = loadTex(TEX_MILKY_WAY, THREE.SRGBColorSpace)

		// ── Globe ──
		const globeGeo = new THREE.SphereGeometry(
			GLOBE_RADIUS,
			GLOBE_SEGMENTS,
			GLOBE_SEGMENTS,
		)
		const globeMat = new THREE.MeshPhysicalMaterial({
			color: GLOBE_COLOR,
			map: dayTex,
			bumpMap: bumpTex,
			bumpScale: GLOBE_BUMP_SCALE,
			roughnessMap: specTex,
			roughness: GLOBE_ROUGHNESS,
			metalness: GLOBE_METALNESS,
			clearcoat: GLOBE_CLEARCOAT,
			clearcoatRoughness: GLOBE_CLEARCOAT_ROUGHNESS,
			emissive: GLOBE_EMISSIVE,
			emissiveIntensity: GLOBE_EMISSIVE_INTENSITY,
			transparent: true,
			opacity: 0.0,
		})

		// nightTex: explicit load with dimension proof callback
		const nightTex = loader.load(
			TEX_NIGHT,
			(tex) => {
				tex.colorSpace = THREE.SRGBColorSpace
				tex.anisotropy = maxAniso
				tex.minFilter = THREE.LinearMipmapLinearFilter
				tex.magFilter = THREE.LinearFilter
				tex.generateMipmaps = true
				globeMat.needsUpdate = true
				console.log("[GlobeViz] earth-night.jpg LOADED", {
					path: TEX_NIGHT,
					width: tex.image?.width,
					height: tex.image?.height,
					colorSpace: tex.colorSpace,
					anisotropy: tex.anisotropy,
					materialType: globeMat.type,
					materialMap: globeMat.map === dayTex ? "dayTex ✅" : "MISMATCH ❌",
					emissiveMap:
						globeMat.emissiveMap === tex ? "nightTex ✅" : "MISMATCH ❌",
				})
			},
			undefined,
			(err) => console.error("[GlobeViz] earth-night.jpg FAILED", err),
		)
		nightTex.colorSpace = THREE.SRGBColorSpace
		nightTex.anisotropy = maxAniso
		nightTex.minFilter = THREE.LinearMipmapLinearFilter
		nightTex.magFilter = THREE.LinearFilter
		nightTex.generateMipmaps = true

		globeMat.emissiveMap = nightTex

		const globeMesh = new THREE.Mesh(globeGeo, globeMat)
		globeGroup.add(globeMesh)

		// ── Clouds ──
		const cloudGeo = new THREE.SphereGeometry(
			GLOBE_RADIUS * CLOUD_RADIUS_SCALE,
			GLOBE_SEGMENTS,
			GLOBE_SEGMENTS,
		)
		const cloudMat = new THREE.MeshPhongMaterial({
			map: cloudTex,
			transparent: true,
			opacity: 0.0,
			depthWrite: false,
			blending: THREE.AdditiveBlending,
		})
		const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat)
		globeGroup.add(cloudMesh)

		// ── Atmosphere ──
		const atmGeo = new THREE.SphereGeometry(
			GLOBE_RADIUS * ATM_RADIUS_SCALE,
			64,
			64,
		)
		const atmMat = new THREE.MeshPhongMaterial({
			color: ATM_COLOR,
			transparent: true,
			opacity: 0.0,
			side: THREE.BackSide,
			depthWrite: false,
		})
		const atmMesh = new THREE.Mesh(atmGeo, atmMat)
		globeGroup.add(atmMesh)

		// ── Stars ──
		const positions = new Float32Array(STAR_COUNT * 3)
		const sizes = new Float32Array(STAR_COUNT)
		const opacities = new Float32Array(STAR_COUNT)
		const phases = new Float32Array(STAR_COUNT)

		const regularCount = STAR_COUNT - STAR_ANCHOR_COUNT
		for (let i = 0; i < regularCount; i++) {
			const r = STAR_MIN_RADIUS + Math.random() * STAR_RADIUS_RANGE
			const theta = Math.random() * Math.PI * 2
			const phi = Math.acos(Math.random() * 2 - 1)
			positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
			positions[i * 3 + 1] = r * Math.cos(phi)
			positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)

			const rand = Math.random()
			let baseSize: number
			let baseOpacity: number
			if (rand < 0.7) {
				baseSize = 0.5 + Math.random() * 0.5
				baseOpacity = 0.2 + Math.random() * 0.3
			} else if (rand < 0.9) {
				baseSize = 1.0 + Math.random() * 0.8
				baseOpacity = 0.4 + Math.random() * 0.3
			} else if (rand < 0.98) {
				baseSize = 1.8 + Math.random() * 0.6
				baseOpacity = 0.6 + Math.random() * 0.3
			} else {
				baseSize = 2.4 + Math.random() * 0.6
				baseOpacity = 0.8 + Math.random() * 0.2
			}

			sizes[i] = baseSize
			opacities[i] = baseOpacity
			phases[i] = Math.random() * Math.PI * 2
		}

		// Anchor stars
		for (let i = 0; i < STAR_ANCHOR_COUNT; i++) {
			const idx = regularCount + i
			const r =
				STAR_ANCHOR_MIN_RADIUS + Math.random() * STAR_ANCHOR_RADIUS_RANGE
			const theta = Math.random() * Math.PI * 2
			const phi = Math.acos(Math.random() * 2 - 1)
			positions[idx * 3] = r * Math.sin(phi) * Math.cos(theta)
			positions[idx * 3 + 1] = r * Math.cos(phi)
			positions[idx * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
			sizes[idx] = 3.5 + Math.random() * 1.0
			opacities[idx] = 1.0
			phases[idx] = Math.random() * Math.PI * 2
		}

		const starGeo = new THREE.BufferGeometry()
		starGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3))
		starGeo.setAttribute("size", new THREE.BufferAttribute(sizes, 1))
		starGeo.setAttribute("opacity", new THREE.BufferAttribute(opacities, 1))
		starGeo.setAttribute("phase", new THREE.BufferAttribute(phases, 1))

		const starMat = new THREE.ShaderMaterial({
			uniforms: {
				color: { value: new THREE.Color(0xffffff) },
				fade: { value: 0.0 },
				time: { value: 0.0 },
			},
			vertexShader: STAR_VERTEX_SHADER,
			fragmentShader: STAR_FRAGMENT_SHADER,
			transparent: true,
			depthWrite: false,
			blending: THREE.AdditiveBlending,
			fog: false,
		})

		const starPoints = new THREE.Points(starGeo, starMat)
		backgroundGroup.add(starPoints)

		// ── Milky Way ──
		const mwGeo = new THREE.SphereGeometry(MW_RADIUS, MW_SEGMENTS, MW_SEGMENTS)
		const mwMat = new THREE.MeshBasicMaterial({
			color: MW_COLOR,
			map: milkyWayTex,
			side: THREE.BackSide,
			transparent: true,
			opacity: MW_OPACITY,
			depthWrite: false,
			blending: THREE.AdditiveBlending,
			fog: false,
		})
		const mwMesh = new THREE.Mesh(mwGeo, mwMat)
		mwMesh.rotation.x = MW_ROTATION_X
		backgroundGroup.add(mwMesh)

		// ── Publish refs ──
		onSceneReady({
			globeMesh,
			globeMat,
			cloudMat,
			atmMat,
			starMat,
			borderMat: null as unknown as THREE.LineBasicMaterial, // Created by parent
			globeGeo,
			cloudGeo,
			atmGeo,
			starGeo,
			mwGeo,
			mwMat,
		})

		return () => {
			scene.remove(hemiLight)
			scene.remove(sun)
			hemiLight.dispose()
			sun.dispose()
			globeGeo.dispose()
			globeMat.dispose()
			cloudGeo.dispose()
			cloudMat.dispose()
			atmGeo.dispose()
			atmMat.dispose()
			starGeo.dispose()
			starMat.dispose()
			mwGeo.dispose()
			mwMat.dispose()
		}
	}, [
		scene,
		renderer,
		globeGroup,
		backgroundGroup,
		onSceneReady,
		onTexturesLoaded,
	])

	return null
}
