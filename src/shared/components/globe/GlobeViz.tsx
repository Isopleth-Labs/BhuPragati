import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

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

// ── COUNTRY HIT-TEST UTILITIES (ported from EarthViewer.jsx) ──
function ringContains(lon, lat, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i, i++) {
    const xi = ring[i][0],
      yi = ring[i][1];
    const xj = ring[j][0],
      yj = ring[j][1];
    const intersect =
      yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function polygonContains(lon, lat, polygon) {
  const [outer, ...holes] = polygon;
  if (!ringContains(lon, lat, outer)) return false;
  for (const hole of holes) {
    if (ringContains(lon, lat, hole)) return false;
  }
  return true;
}

function featureContains(lon, lat, coords, type) {
  const polygons =
    type === "Polygon" ? [coords] : type === "MultiPolygon" ? coords : [];
  return polygons.some((poly) => polygonContains(lon, lat, poly));
}

// ── EARTHVIEWER GEOMETRY PIPELINE ────────────────────────────
function unwrapRing(ring) {
  if (!ring.length) return ring;
  const unwrapped = [[ring[0][0], ring[0][1]]];
  let lastLon = ring[0][0];
  for (let i = 1; i < ring.length; i++) {
    let lon = ring[i][0];
    const lat = ring[i][1];
    let diff = lon - lastLon;
    if (diff > 180) lon -= 360;
    else if (diff < -180) lon += 360;
    diff = lon - lastLon;
    if (diff > 180) lon -= 360;
    if (diff < -180) lon += 360;
    unwrapped.push([lon, lat]);
    lastLon = lon;
  }
  const first = unwrapped[0];
  const last = unwrapped[unwrapped.length - 1];
  if (
    Math.abs(first[0] - last[0]) > 1e-6 ||
    Math.abs(first[1] - last[1]) > 1e-6
  ) {
    unwrapped.push([...first]);
  }
  return unwrapped;
}

function buildGreatCirclePoints(a, b, toVec3, radius) {
  const v1 = toVec3(a[1], a[0], radius);
  const v2 = toVec3(b[1], b[0], radius);
  const angle = v1.angleTo(v2);
  const stepRad = THREE.MathUtils.degToRad(2);
  const steps = Math.max(1, Math.ceil(angle / stepRad));
  const points = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const v = new THREE.Vector3()
      .lerpVectors(v1, v2, t)
      .normalize()
      .multiplyScalar(radius);
    points.push(v);
  }
  return points;
}

function ringArea(ring) {
  let area = 0;
  for (let i = 0; i < ring.length; i++) {
    const p1 = ring[i];
    const p2 = ring[(i + 1) % ring.length];
    area += p1[0] * p2[1] - p2[0] * p1[1];
  }
  return Math.abs(area) * 0.5;
}

function computeCentroidVector(polygons, toVec3, radius) {
  let bestRing = polygons?.[0]?.[0] ?? [];
  let maxArea = -Infinity;
  polygons.forEach((poly) => {
    const outer = poly[0];
    const area = ringArea(outer);
    if (area > maxArea) {
      maxArea = area;
      bestRing = outer;
    }
  });
  if (!bestRing.length) return new THREE.Vector3(0, 0, radius);
  const centroidVec = new THREE.Vector3();
  bestRing.forEach((p) => {
    centroidVec.add(toVec3(p[1], p[0], 1));
  });
  if (centroidVec.lengthSq() === 0) return new THREE.Vector3(0, 0, radius);
  return centroidVec.normalize();
}

// Build triangulated fill geometry for a country using EarthViewer approach
function buildCountryFill(coordinates, type, toVec3, radius) {
  const polygons =
    type === "Polygon"
      ? [coordinates]
      : type === "MultiPolygon"
        ? coordinates
        : [];
  const geometries = [];
  const up = new THREE.Vector3(0, 1, 0);

  polygons.forEach((poly) => {
    const outerRing = unwrapRing(poly[0]);
    const holeRings = poly.slice(1).map((r) => unwrapRing(r));

    const densifyRing = (ring) => {
      const pts = [];
      for (let i = 0; i < ring.length - 1; i++) {
        const a = ring[i];
        const b = ring[i + 1];
        const arc = buildGreatCirclePoints(a, b, toVec3, radius);
        if (i > 0 && arc.length > 0) arc.shift();
        pts.push(...arc);
      }
      return pts;
    };

    const outerPts = densifyRing(outerRing);
    const holePts = holeRings.map((r) => densifyRing(r));

    if (outerPts.length < 3) return;

    // Projection basis using largest ring's centroid
    const basisNormal = computeCentroidVector([poly], toVec3, 1);
    let tangent = new THREE.Vector3().crossVectors(basisNormal, up);
    if (tangent.lengthSq() < 1e-6) {
      tangent = new THREE.Vector3().crossVectors(
        basisNormal,
        new THREE.Vector3(1, 0, 0),
      );
    }
    tangent.normalize();
    const bitangent = new THREE.Vector3()
      .crossVectors(basisNormal, tangent)
      .normalize();

    const project2D = (vec3) =>
      new THREE.Vector2(vec3.dot(tangent), vec3.dot(bitangent));
    const outer2D = outerPts.map(project2D);
    const holes2D = holePts.map((ring) => ring.map(project2D));

    try {
      const triangles = THREE.ShapeUtils.triangulateShape(outer2D, holes2D);
      if (!triangles.length) return;

      const geom = new THREE.BufferGeometry();
      const vertices = [...outerPts];
      holePts.forEach((ring) => {
        vertices.push(...ring);
      });

      const flatPositions = new Float32Array(vertices.length * 3);
      vertices.forEach((v, idx) => {
        flatPositions[idx * 3] = v.x;
        flatPositions[idx * 3 + 1] = v.y;
        flatPositions[idx * 3 + 2] = v.z;
      });

      const triIndices = [];
      const totalOuter = outerPts.length;
      const holeSizes = holePts.map((r) => r.length);

      const resolveIndex = (idx) => {
        if (idx < totalOuter) return idx;
        let offset = totalOuter;
        for (let h = 0; h < holeSizes.length; h++) {
          const size = holeSizes[h];
          if (idx < offset + size) return idx;
          offset += size;
        }
        return idx;
      };

      triangles.forEach((tri) => {
        const [a, b, c] = tri;
        triIndices.push(resolveIndex(a), resolveIndex(b), resolveIndex(c));
      });

      geom.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(flatPositions, 3),
      );
      geom.setIndex(triIndices);
      geom.computeVertexNormals();
      geometries.push(geom);
    } catch (_e) {
      // skip invalid triangulation
    }
  });

  return geometries;
}

export default function GlobeViz() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // ── RENDERER ─────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000); // Space color: pure pitch black
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.55;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // ── SCENE ─────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // Pitch black void
    scene.fog = new THREE.FogExp2(0x000000, 0.012); // Pitch black fog

    // ── CAMERA ────────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(
      32,
      container.clientWidth / container.clientHeight,
      0.1,
      2000,
    );
    camera.position.set(0, 0.08, 4.0);
    camera.lookAt(0, 0, 0);

    // ── CONTROLS ──────────────────────────────────────────────
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.minDistance = 2.8;
    controls.maxDistance = 10.0;
    controls.rotateSpeed = 0.4;
    controls.zoomSpeed = 0.6;

    // ── TEXTURE & ASSET LOADING MANAGER ──────────────────────
    let texturesLoaded = false;
    let geoJsonLoaded = false;
    let assetsLoaded = false;
    let fadeFactor = 0.0;

    const loadingManager = new THREE.LoadingManager();
    loadingManager.onLoad = () => {
      texturesLoaded = true;
      checkAssetsLoaded();
    };

    function checkAssetsLoaded() {
      if (texturesLoaded && geoJsonLoaded) {
        assetsLoaded = true;
      }
    }

    const loader = new THREE.TextureLoader(loadingManager);
    const maxAniso = renderer.capabilities.getMaxAnisotropy();

    function loadTex(path, colorSpace = null) {
      const t = loader.load(path);
      t.anisotropy = maxAniso;
      t.minFilter = THREE.LinearMipmapLinearFilter;
      t.magFilter = THREE.LinearFilter;
      t.generateMipmaps = true;
      if (colorSpace) t.colorSpace = colorSpace;
      return t;
    }

    const dayTex = loadTex(
      "/homepage-earth/earth-day-topo.jpg",
      THREE.SRGBColorSpace,
    );

    // nightTex: explicit load with dimension proof callback
    const nightTex = loader.load(
      "/homepage-earth/earth-night.jpg",
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = maxAniso;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.generateMipmaps = true;
        globeMat.needsUpdate = true;
        console.log("[GlobeViz] earth-night.jpg LOADED", {
          path: "/homepage-earth/earth-night.jpg",
          width: tex.image?.width,
          height: tex.image?.height,
          colorSpace: tex.colorSpace,
          anisotropy: tex.anisotropy,
          materialType: globeMat.type,
          materialMap: globeMat.map === dayTex ? "dayTex ✅" : "MISMATCH ❌",
          emissiveMap:
            globeMat.emissiveMap === tex ? "nightTex ✅" : "MISMATCH ❌",
        });
      },
      undefined,
      (err) => console.error("[GlobeViz] earth-night.jpg FAILED", err),
    );
    nightTex.colorSpace = THREE.SRGBColorSpace;
    nightTex.anisotropy = maxAniso;
    nightTex.minFilter = THREE.LinearMipmapLinearFilter;
    nightTex.magFilter = THREE.LinearFilter;
    nightTex.generateMipmaps = true;

    const bumpTex = loadTex("/homepage-earth/earth-topology.png");
    const specTex = loadTex("/homepage-earth/earth-water.png");
    const cloudTex = loadTex(
      "/homepage-earth/earth-clouds.png",
      THREE.SRGBColorSpace,
    );
    const milkyWayTex = loadTex(
      "/homepage-earth/8k_stars_milky_way.jpg",
      THREE.SRGBColorSpace,
    );

    // ── LIGHTING ──────────────────────────────────────────────
    const hemiLight = new THREE.HemisphereLight(
      0xbfd1e5, // Desaturated grey-blue sky reflection
      0x030305, // Dark space ground reflection
      0.12, // Reduced from 0.20 to make nighttime shadows deeper
    );
    scene.add(hemiLight);

    const sun = new THREE.DirectionalLight(0xfffbf4, 1.35); // Reduced to 1.35 (1.5 - 10%) for darker day side
    sun.position.set(320, 180, -220);
    scene.add(sun);

    // ── GLOBE ─────────────────────────────────────────────────
    const RADIUS = 1.0;
    const globeGeo = new THREE.SphereGeometry(RADIUS, 128, 128);
    const globeMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x757575), // Subdues day-side reflectivity to darken land/snow/ice
      map: dayTex,
      bumpMap: bumpTex,
      bumpScale: 0.008,
      roughnessMap: specTex,
      roughness: 0.9, // Increased to reduce specular glare
      metalness: 0.02,
      clearcoat: 0.0, // Removed clearcoat glossiness to eliminate sun glare
      clearcoatRoughness: 0.8,
      emissive: new THREE.Color(0xffffff),
      emissiveMap: nightTex,
      emissiveIntensity: 1.0,
      transparent: true,
      opacity: 0.0, // Start fully transparent to prevent loading flashes
    });
    const globeMesh = new THREE.Mesh(globeGeo, globeMat);

    // ── CLOUDS ────────────────────────────────────────────────
    const cloudGeo = new THREE.SphereGeometry(RADIUS * 1.006, 128, 128);
    const cloudMat = new THREE.MeshPhongMaterial({
      map: cloudTex,
      transparent: true,
      opacity: 0.0, // Start transparent, fade in dynamically
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);

    // ── ATMOSPHERE V2 ─────────────────────────────────────────
    // Desaturated neutral Earth-blue glow, tuned for realism (rim close to limb, lower opacity)
    const atmGeo = new THREE.SphereGeometry(RADIUS * 1.01, 64, 64);
    const atmMat = new THREE.MeshPhongMaterial({
      color: 0x1a2636, // Less saturated, darker slate blue-grey
      transparent: true,
      opacity: 0.0, // Start fully transparent to prevent loading flashes, fades in dynamically
      side: THREE.BackSide,
      depthWrite: false,
    });
    const atmMesh = new THREE.Mesh(atmGeo, atmMat);

    // ── GLOBE GROUP — India centered ─────────────────────────
    const globeGroup = new THREE.Group();
    globeGroup.add(globeMesh);
    globeGroup.add(cloudMesh);
    globeGroup.add(atmMesh);
    scene.add(globeGroup);

    // Orient India toward camera
    // India centroid ≈ lat 22.5, lon 78.9
    // THREE.SphereGeometry: phi = polar from +Y, theta = azimuth from +Z
    const lat = 22.5 * (Math.PI / 180);
    const lon = 78.9 * (Math.PI / 180);
    // Rotate so India faces +Z (camera direction)
    globeGroup.rotation.y = -2 * lon; // longitude offset to center India (78.9° E)
    globeGroup.rotation.x = lat * 0.55; // tilt slightly for India to appear centered

    // ── BACKGROUND STARFIELD & MILKY WAY GROUP ────────────────
    const backgroundGroup = new THREE.Group();
    scene.add(backgroundGroup);

    // ── STARS V5 ──────────────────────────────────────────────
    // High density realistic starfield: 70% tiny, 20% medium, 8% bright, 2% very bright
    const starCount = 30000;
    const positions = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);
    const opacities = new Float32Array(starCount);
    const phases = new Float32Array(starCount);

    // Generate regular stars (first 29,985 stars)
    for (let i = 0; i < starCount - 15; i++) {
      const r = 120 + Math.random() * 160;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi);
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

			const rand = Math.random()
			let baseSize: number, baseOpacity: number
			if (rand < 0.7) {
				// 70% tiny dim stars (0.5px to 1.0px equivalent, opacity 0.2 to 0.5)
				baseSize = 0.5 + Math.random() * 0.5
				baseOpacity = 0.2 + Math.random() * 0.3
			} else if (rand < 0.9) {
				// 20% medium stars (1.0px to 1.8px equivalent, opacity 0.4 to 0.7)
				baseSize = 1.0 + Math.random() * 0.8
				baseOpacity = 0.4 + Math.random() * 0.3
			} else if (rand < 0.98) {
				// 8% bright stars (1.8px to 2.4px equivalent, opacity 0.6 to 0.9)
				baseSize = 1.8 + Math.random() * 0.6
				baseOpacity = 0.6 + Math.random() * 0.3
			} else {
				// 2% very bright stars (2.4px to 3.0px equivalent, opacity 0.8 to 1.0)
				baseSize = 2.4 + Math.random() * 0.6
				baseOpacity = 0.8 + Math.random() * 0.2
			}


      sizes[i] = baseSize;
      opacities[i] = baseOpacity;
      phases[i] = Math.random() * Math.PI * 2;
    }

    // Add 15 bright anchor stars visible immediately (Requirement 5)
    for (let i = 0; i < 15; i++) {
      const idx = starCount - 15 + i;
      const r = 140 + Math.random() * 100;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      positions[idx * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[idx * 3 + 1] = r * Math.cos(phi);
      positions[idx * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      sizes[idx] = 3.5 + Math.random() * 1.0; // 3.5px to 4.5px
      opacities[idx] = 1.0; // Maximum opacity
      phases[idx] = Math.random() * Math.PI * 2;
    }

    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    starGeo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    starGeo.setAttribute("opacity", new THREE.BufferAttribute(opacities, 1));
    starGeo.setAttribute("phase", new THREE.BufferAttribute(phases, 1));

    const starMat = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(0xffffff) },
        fade: { value: 0.0 },
        time: { value: 0.0 },
      },
      vertexShader: `
        attribute float size;
        attribute float opacity;
        attribute float phase;
        varying float vOpacity;
        varying float vPhase;
        void main() {
          vOpacity = opacity;
          vPhase = phase;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform float fade;
        uniform float time;
        varying float vOpacity;
        varying float vPhase;
        void main() {
          // Circular star shape
          vec2 coord = gl_PointCoord - vec2(0.5);
          if (length(coord) > 0.5) discard;
          
          // Organic, time-based smooth starlight twinkling
          float twinkle = 1.0;
          if (vOpacity < 1.0) {
            twinkle = 0.7 + 0.3 * sin(time * 1.5 + vPhase);
          } else {
            twinkle = 0.95 + 0.05 * sin(time * 0.5 + vPhase); // Anchor stars are stable
          }
          
          gl_FragColor = vec4(color, vOpacity * fade * twinkle);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      fog: false,
    });

    const starPoints = new THREE.Points(starGeo, starMat);
    backgroundGroup.add(starPoints);

    // ── MILKY WAY ─────────────────────────────────────────────
    const mwGeo = new THREE.SphereGeometry(400, 64, 64);
    const mwMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0x808080), // Pure neutral grey multiplier (removes any blue tint)
      map: milkyWayTex,
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.04, // Very faint Milky Way (Requirement 6)
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      fog: false,
    });
    const mwMesh = new THREE.Mesh(mwGeo, mwMat);
    mwMesh.rotation.x = Math.PI / 6;
    backgroundGroup.add(mwMesh);

    // ── COUNTRY BORDERS (GeoJSON) ────────────────────────────
    const borderLines = new THREE.Group();
    borderLines.visible = true; // DIAGNOSTIC: hidden to verify texture without border occlusion
    scene.add(borderLines);

    const borderMat = new THREE.LineBasicMaterial({
      color: 0x9bb0c8,
      transparent: true,
      opacity: 0.0, // Start transparent, fade in dynamically
      depthTest: true,
    });

    const hoverBorderMat = new THREE.LineBasicMaterial({
      color: 0x7fc8ff,
      transparent: true,
      opacity: 1.0,
      depthTest: true,
    });

    const selectedBorderMat = new THREE.LineBasicMaterial({
      color: 0xaee4ff,
      transparent: true,
      opacity: 1.0,
      depthTest: true,
    });

    // ── COUNTRY FILL (selection highlight) ────────────────────
    const fillGroup = new THREE.Group();
    fillGroup.visible = true;
    scene.add(fillGroup);

    const highlightMat = new THREE.MeshBasicMaterial({
      color: 0x3a8fd6,
      transparent: true,
      opacity: 0.0,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    function latLonToVec3(lat, lon, r) {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      return new THREE.Vector3(
        -r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta),
      );
    }

    const countryEntries = [];
    let selectedEntry = null;

    fetch("/homepage-earth/countries-110m.geojson")
      .then((r) => r.json())
      .then((data) => {
        data.features.forEach((feature) => {
          const name = feature.properties?.name ?? "Unknown";
          const geom = feature.geometry;
          const rings =
            geom.type === "Polygon"
              ? geom.coordinates
              : geom.type === "MultiPolygon"
                ? geom.coordinates.flat(1)
                : [];

          // Build border lines
          const borderMeshes = [];
          rings.forEach((ring) => {
            const pts = ring.map(([lon, lat]) =>
              latLonToVec3(lat, lon, RADIUS * 1.002),
            );
            const geo = new THREE.BufferGeometry().setFromPoints(pts);
            const mesh = new THREE.Line(geo, borderMat);
            borderLines.add(mesh);
            borderMeshes.push(mesh);
          });

          // Build fill meshes (hidden by default)
          const fillGeometries = buildCountryFill(
            geom.coordinates,
            geom.type,
            latLonToVec3,
            RADIUS * 1.0015,
          );
          const fillMeshes = fillGeometries.map((geo) => {
            const mesh = new THREE.Mesh(geo, highlightMat.clone());
            mesh.visible = false;
            fillGroup.add(mesh);
            return mesh;
          });

          const polys =
            geom.type === "Polygon"
              ? [geom.coordinates]
              : geom.type === "MultiPolygon"
                ? geom.coordinates
                : [];
          let centroid = new THREE.Vector3(0, 0, RADIUS);
          if (polys.length) {
            centroid = computeCentroidVector(polys, latLonToVec3, RADIUS);
          }

          // Store country entry for click/hover detection
          countryEntries.push({
            name,
            type: geom.type,
            coordinates: geom.coordinates,
            fillMeshes,
            borderMeshes,
            centroid,
          });
        });
        // Match globe group orientation
        borderLines.rotation.copy(globeGroup.rotation);
        fillGroup.rotation.copy(globeGroup.rotation);
        console.log(
          `[GlobeViz] ${countryEntries.length} countries loaded for interaction`,
        );
        geoJsonLoaded = true;
        checkAssetsLoaded();
      })
      .catch((err) => {
        console.warn("[GlobeViz] GeoJSON load failed", err);
        geoJsonLoaded = true;
        checkAssetsLoaded();
      });

    // ── RESIZE ────────────────────────────────────────────────
    function onResize() {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener("resize", onResize);

    // ── TOOLTIP ──────────────────────────────────────────────
    const tooltip = document.createElement("div");
    tooltip.className =
      "fixed pointer-events-none rounded-md bg-black/80 px-2.5 py-1.5 text-xs font-semibold text-white whitespace-nowrap opacity-0 transition-opacity duration-100 z-[9999]";
    document.body.appendChild(tooltip);

    // ── COUNTRY CLICK & HOVER DETECTION ───────────────────────
    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2();
    let hoveredCountryName = null;

    // Shared: raycast → lat/lon → country lookup
    function hitTestCountry(event) {
      if (!countryEntries.length) return null;
      const rect = renderer.domElement.getBoundingClientRect();
      pointerNdc.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointerNdc.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointerNdc, camera);

      const hits = raycaster.intersectObject(globeMesh, false);
      if (!hits.length) return null;

      const localPoint = globeGroup.worldToLocal(hits[0].point.clone());
      const norm = localPoint.normalize();
      const hitLat = THREE.MathUtils.radToDeg(Math.asin(norm.y));
      const hitLon =
        THREE.MathUtils.radToDeg(Math.atan2(norm.z, -norm.x)) - 180;
      const normLon = ((hitLon + 540) % 360) - 180;

      for (const entry of countryEntries) {
        if (featureContains(normLon, hitLat, entry.coordinates, entry.type)) {
          return entry.name;
        }
      }
      return null;
    }

    // Click handler — select/deselect country
    let fadeAnim = null;
    let cameraTargetPos = null;

    function selectCountryByName(name) {
      // Deselect previous
      if (selectedEntry) {
        selectedEntry.fillMeshes.forEach((m) => {
          m.material.opacity = 0.0;
          m.visible = false;
        });
        selectedEntry.borderMeshes.forEach((m) => {
          m.material = borderMat;
        });
        if (fadeAnim) {
          cancelAnimationFrame(fadeAnim);
          fadeAnim = null;
        }
      }

      if (name) {
        const entry = countryEntries.find((e) => e.name === name);
        if (entry) {
          selectedEntry = entry;

          // Set border material
          entry.borderMeshes.forEach((m) => {
            m.material = selectedBorderMat;
          });

          if (entry.fillMeshes.length) {
            // Fade in
            entry.fillMeshes.forEach((m) => {
              m.visible = true;
              m.material.opacity = 0.0;
            });
            let progress = 0;
            const fadeIn = () => {
              progress += 0.06;
              const opacity = Math.min(progress, 0.3);
              entry.fillMeshes.forEach((m) => {
                m.material.opacity = opacity;
              });
              if (progress < 0.3) fadeAnim = requestAnimationFrame(fadeIn);
              else fadeAnim = null;
            };
            fadeAnim = requestAnimationFrame(fadeIn);
          }
          console.log(`Selected: ${name}`);

          // Set camera target for smooth rotation
          if (entry.centroid) {
            const worldCentroid = entry.centroid
              .clone()
              .applyMatrix4(globeGroup.matrixWorld)
              .normalize();
            cameraTargetPos = worldCentroid.multiplyScalar(
              camera.position.length(),
            );
          }
        }
      } else {
        selectedEntry = null;
        cameraTargetPos = null;
        console.log("[GlobeViz] Selection cleared");
      }
    }

    function onGlobeClick(event) {
      const name = hitTestCountry(event);
      selectCountryByName(name);
    }

    // Hover handler (throttled via rAF)
    let hoverRafPending = false;
    let lastMoveEvent = null;
    function onPointerMove(event) {
      lastMoveEvent = event;
      if (hoverRafPending) return;
      hoverRafPending = true;
      requestAnimationFrame(() => {
        hoverRafPending = false;
        const evt = lastMoveEvent;
        const name = hitTestCountry(evt);
        if (name !== hoveredCountryName) {
          // Deselect old hover
          if (hoveredCountryName) {
            const oldEntry = countryEntries.find(
              (e) => e.name === hoveredCountryName,
            );
            if (oldEntry && oldEntry !== selectedEntry) {
              oldEntry.borderMeshes.forEach((m) => {
                m.material = borderMat;
              });
            }
          }

          hoveredCountryName = name;

          if (name) {
            const newEntry = countryEntries.find((e) => e.name === name);
            if (newEntry && newEntry !== selectedEntry) {
              newEntry.borderMeshes.forEach((m) => {
                m.material = hoverBorderMat;
              });
            }
            tooltip.textContent = name;
            tooltip.style.opacity = "1";
            container.style.cursor = "pointer";
          } else {
            tooltip.style.opacity = "0";
            container.style.cursor = "grab";
          }
        }
        // Always update position when visible
        if (hoveredCountryName) {
          tooltip.style.left = `${evt.clientX + 14}px`;
          tooltip.style.top = `${evt.clientY + 14}px`;
        }
      });
    }

    // Use pointerup with distance check to avoid firing on drag
    let pointerDownPos = null;
    function onPointerDown(event) {
      pointerDownPos = { x: event.clientX, y: event.clientY };
      cameraTargetPos = null; // user interaction cancels auto-rotation
    }
    function onPointerUp(event) {
      if (!pointerDownPos) return;
      const dx = event.clientX - pointerDownPos.x;
      const dy = event.clientY - pointerDownPos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 5) onGlobeClick(event);
      pointerDownPos = null;
    }

    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointerup", onPointerUp);
    container.addEventListener("pointermove", onPointerMove);

		// ── ANIMATION LOOP ────────────────────────────────────────
		let animId: number
		const clock = new THREE.Clock()
		function animate() {
			animId = requestAnimationFrame(animate)
			const t = clock.getElapsedTime()

      // pulse selected border
      selectedBorderMat.opacity = 0.5 + 0.5 * Math.sin(t * 8);

      // smooth camera rotation to country centroid
      if (cameraTargetPos) {
        camera.position.lerp(cameraTargetPos, 0.05);
        if (camera.position.distanceTo(cameraTargetPos) < 0.01) {
          cameraTargetPos = null;
        }
      }

      // Smooth fade-in once assets are loaded
      if (assetsLoaded && fadeFactor < 1.0) {
        fadeFactor = Math.min(1.0, fadeFactor + 0.04);
        globeMat.opacity = fadeFactor;
        cloudMat.opacity = fadeFactor * 0.36;
        atmMat.opacity = fadeFactor * 0.054; // Reduced by 25% (0.072 * 0.75) for a very thin subtle rim
        borderMat.opacity = fadeFactor * 0.35;
        starMat.uniforms.fade.value = fadeFactor;

        // Once fully faded in, make globe opaque so sorting/depth works optimally
        if (fadeFactor >= 1.0) {
          globeMat.transparent = false;
          globeMat.needsUpdate = true;
        }
      }

      // Slowly and smoothly rotate background starfield & Milky Way for subtle realism
      // Time-based (delta-independent) rotation avoids micro-stutter
      backgroundGroup.rotation.y = t * 0.0018;

      // Update star twinkling shader time
      starMat.uniforms.time.value = t;

      // AUTO-ROTATION DISABLED — verifying startup India orientation
      // globeGroup.rotation.y  += 0.00018
      // borderLines.rotation.y += 0.00018
      // cloudMesh.rotation.y   += 0.000025
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    // ── CLEANUP ───────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId);
      controls.dispose();
      window.removeEventListener("resize", onResize);
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("pointermove", onPointerMove);
      if (tooltip.parentNode) tooltip.parentNode.removeChild(tooltip);
      renderer.dispose();
      globeMat.dispose();
      cloudMat.dispose();
      atmMat.dispose();
      globeGeo.dispose();
      cloudGeo.dispose();
      atmGeo.dispose();
      mwGeo.dispose();
      mwMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      borderMat.dispose();
      hoverBorderMat.dispose();
      selectedBorderMat.dispose();
      highlightMat.dispose();
      countryEntries.forEach((entry) => {
        entry.fillMeshes.forEach((m) => {
          m.geometry.dispose();
          m.material.dispose();
        });
        entry.borderMeshes.forEach((m) => {
          m.geometry.dispose();
        });
      });
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
}
