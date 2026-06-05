import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * GlobeViz — Cinematic NASA Orbital Earth
 *
 * Reconstructed from transcript parameters (2026-05-26 final state):
 *   - MeshPhysicalMaterial with clearcoat
 *   - earth-night.jpg primary texture
 *   - earth-topology.png bump map
 *   - earth-water.png specular/roughness map
 *   - earth-clouds.png cloud layer
 *   - camera.position.set(0, 0.08, 2.7), FOV 32
 *   - ACESFilmicToneMapping, exposure 1.35
 *   - scene.background 0x01040a
 *   - 15000 stars
 *   - GeoJSON country borders (white lines)
 *   - India-centered orientation
 */
export default function GlobeViz() {
  const mountRef = useRef(null)

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    // ── RENDERER ─────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.55
    renderer.outputColorSpace = THREE.SRGBColorSpace
    container.appendChild(renderer.domElement)

    // ── SCENE ─────────────────────────────────────────────────
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x01040a)
    scene.fog = new THREE.FogExp2(0x01040a, 0.012)

    // ── CAMERA ────────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(
      32,
      container.clientWidth / container.clientHeight,
      0.1,
      2000
    )
    camera.position.set(0, 0.08, 4.0)
    camera.lookAt(0, 0, 0)

    // ── TEXTURES ──────────────────────────────────────────────
    const loader = new THREE.TextureLoader()
    const maxAniso = renderer.capabilities.getMaxAnisotropy()

    function loadTex(path, colorSpace = null) {
      const t = loader.load(path)
      t.anisotropy = maxAniso
      t.minFilter = THREE.LinearMipmapLinearFilter
      t.magFilter = THREE.LinearFilter
      t.generateMipmaps = true
      if (colorSpace) t.colorSpace = colorSpace
      return t
    }

    const dayTex = loadTex('/homepage-earth/earth-day-topo.jpg', THREE.SRGBColorSpace)

    // nightTex: explicit load with dimension proof callback
    const nightTex = loader.load(
      '/homepage-earth/earth-night.jpg',
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace
        tex.anisotropy = maxAniso
        tex.minFilter = THREE.LinearMipmapLinearFilter
        tex.magFilter = THREE.LinearFilter
        tex.generateMipmaps = true
        globeMat.needsUpdate = true
        console.log('[GlobeViz] earth-night.jpg LOADED', {
          path: '/homepage-earth/earth-night.jpg',
          width: tex.image?.width,
          height: tex.image?.height,
          colorSpace: tex.colorSpace,
          anisotropy: tex.anisotropy,
          materialType: globeMat.type,
          materialMap: globeMat.map === dayTex ? 'dayTex ✅' : 'MISMATCH ❌',
          emissiveMap: globeMat.emissiveMap === tex ? 'nightTex ✅' : 'MISMATCH ❌',
        })
      },
      undefined,
      (err) => console.error('[GlobeViz] earth-night.jpg FAILED', err)
    )
    nightTex.colorSpace = THREE.SRGBColorSpace
    nightTex.anisotropy = maxAniso
    nightTex.minFilter = THREE.LinearMipmapLinearFilter
    nightTex.magFilter = THREE.LinearFilter
    nightTex.generateMipmaps = true

    const bumpTex  = loadTex('/homepage-earth/earth-topology.png')
    const specTex  = loadTex('/homepage-earth/earth-water.png')
    const cloudTex = loadTex('/homepage-earth/earth-clouds.png', THREE.SRGBColorSpace)

    // ── LIGHTING ──────────────────────────────────────────────
    const hemiLight = new THREE.HemisphereLight(
      0x6fa8ff,
      0x020308,
      0.22
    )
    scene.add(hemiLight)

    const sun = new THREE.DirectionalLight(0x4a6fa5, 2.5)
    sun.position.set(320, 180, -220)
    scene.add(sun)

    // ── GLOBE ─────────────────────────────────────────────────
    const RADIUS = 1.0
    const globeGeo = new THREE.SphereGeometry(RADIUS, 128, 128)
    const globeMat = new THREE.MeshPhysicalMaterial({
      map: dayTex,
      bumpMap: bumpTex,
      bumpScale: 0.008,
      roughnessMap: specTex,
      roughness: 0.82,
      metalness: 0.02,
      clearcoat: 0.18,
      clearcoatRoughness: 0.45,
      emissive: new THREE.Color(0xffffff),
      emissiveMap: nightTex,
      emissiveIntensity: 1.0,
    })
    const globeMesh = new THREE.Mesh(globeGeo, globeMat)

    // ── CLOUDS ────────────────────────────────────────────────
    const cloudGeo = new THREE.SphereGeometry(RADIUS * 1.006, 128, 128)
    const cloudMat = new THREE.MeshPhongMaterial({
      map: cloudTex,
      transparent: true,
      opacity: 0.36,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat)

    // ── ATMOSPHERE RIM ────────────────────────────────────────
    // Thin dark-blue rim — matches screenshot (no bright sci-fi glow)
    const atmGeo = new THREE.SphereGeometry(RADIUS * 1.012, 64, 64)
    const atmMat = new THREE.MeshPhongMaterial({
      color: 0x0a1a3a,
      transparent: true,
      opacity: 0.18,
      side: THREE.BackSide,
      depthWrite: false,
    })
    const atmMesh = new THREE.Mesh(atmGeo, atmMat)

    // ── GLOBE GROUP — India centered ─────────────────────────
    const globeGroup = new THREE.Group()
    globeGroup.add(globeMesh)
    globeGroup.add(cloudMesh)
    globeGroup.add(atmMesh)
    scene.add(globeGroup)

    // Orient India toward camera
    // India centroid ≈ lat 22.5, lon 78.9
    // THREE.SphereGeometry: phi = polar from +Y, theta = azimuth from +Z
    const lat = 22.5 * (Math.PI / 180)
    const lon = 78.9 * (Math.PI / 180)
    // Rotate so India faces +Z (camera direction)
    globeGroup.rotation.y = -2 * lon   // longitude offset to center India (78.9° E)
    globeGroup.rotation.x = lat * 0.55       // tilt slightly for India to appear centered

    // ── STARS ─────────────────────────────────────────────────
    const STAR_COUNT = 15000
    const starPositions = new Float32Array(STAR_COUNT * 3)
    for (let i = 0; i < STAR_COUNT; i++) {
      const r = 60 + Math.random() * 60
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      starPositions[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      starPositions[i * 3 + 1] = r * Math.cos(phi)
      starPositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
    }
    const starGeo = new THREE.BufferGeometry()
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.06,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    scene.add(new THREE.Points(starGeo, starMat))

    // ── COUNTRY BORDERS (GeoJSON) ────────────────────────────
    const borderLines = new THREE.Group()
    borderLines.visible = true  // DIAGNOSTIC: hidden to verify texture without border occlusion
    scene.add(borderLines)

    const borderMat = new THREE.LineBasicMaterial({
      color: 0x9bb0c8,
      transparent: true,
      opacity: 0.35,
      depthTest: true,
    })

    function latLonToVec3(lat, lon, r) {
      const phi   = (90 - lat) * (Math.PI / 180)
      const theta = (lon + 180) * (Math.PI / 180)
      return new THREE.Vector3(
        -r * Math.sin(phi) * Math.cos(theta),
         r * Math.cos(phi),
         r * Math.sin(phi) * Math.sin(theta)
      )
    }

    fetch('/homepage-earth/countries-110m.geojson')
      .then(r => r.json())
      .then(data => {
        data.features.forEach(feature => {
          const geom = feature.geometry
          const rings =
            geom.type === 'Polygon'
              ? geom.coordinates
              : geom.type === 'MultiPolygon'
              ? geom.coordinates.flat(1)
              : []

          rings.forEach(ring => {
            const pts = ring.map(([lon, lat]) => latLonToVec3(lat, lon, RADIUS * 1.002))
            const geo = new THREE.BufferGeometry().setFromPoints(pts)
            borderLines.add(new THREE.Line(geo, borderMat))
          })
        })
        // Match globe group orientation
        borderLines.rotation.copy(globeGroup.rotation)
      })
      .catch(err => console.warn('[GlobeViz] GeoJSON load failed', err))

    // ── RESIZE ────────────────────────────────────────────────
    function onResize() {
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    // ── ANIMATION LOOP ────────────────────────────────────────
    let animId
    const clock = new THREE.Clock()
    function animate() {
      animId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()
      // AUTO-ROTATION DISABLED — verifying startup India orientation
      // globeGroup.rotation.y  += 0.00018
      // borderLines.rotation.y += 0.00018
      // cloudMesh.rotation.y   += 0.000025
      renderer.render(scene, camera)
    }
    animate()

    // ── CLEANUP ───────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      globeMat.dispose()
      cloudMat.dispose()
      atmMat.dispose()
      globeGeo.dispose()
      cloudGeo.dispose()
      atmGeo.dispose()
      starGeo.dispose()
      starMat.dispose()
      borderMat.dispose()
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={mountRef}
      style={{ width: '100%', height: '100%' }}
    />
  )
}
