// Subtle command-center pulse. Single rAF loop, gentle amplitude.

export function startFocusPulse(map: Map) {
	let frame = 0

	// Layers to gently breathe (intelligence sectors).
	const sectorGlows = [
		"flood-risk-glow",
		"road-corridor-glow",
		"electricity-feeder-glow",
	]

	const tick = (time: number) => {
		const fast = (Math.sin(time / 1400) + 1) / 2
		const slow = (Math.sin(time / 2400) + 1) / 2
		const cool = (Math.sin(time / 3200) + 1) / 2

		if (map.getLayer("command-halo-cool")) {
			map.setPaintProperty("command-halo-cool", "circle-radius", 45 + cool * 15)
			map.setPaintProperty(
				"command-halo-cool",
				"circle-opacity",
				0.08 + cool * 0.12,
			)
		}

		if (map.getLayer("command-pulse-outer")) {
			map.setPaintProperty(
				"command-pulse-outer",
				"circle-radius",
				30 + slow * 10,
			)
			map.setPaintProperty(
				"command-pulse-outer",
				"circle-opacity",
				0.14 + (1 - slow) * 0.16,
			)
		}
		if (map.getLayer("command-pulse")) {
			map.setPaintProperty("command-pulse", "circle-radius", 16 + fast * 6)
			map.setPaintProperty(
				"command-pulse",
				"circle-opacity",
				0.22 + (1 - fast) * 0.28,
			)
		}
		if (map.getLayer("command-ring")) {
			map.setPaintProperty(
				"command-ring",
				"circle-stroke-opacity",
				0.55 + fast * 0.35,
			)
		}
		// Slow shimmer on outer aura (different phase for organic feel).
		const aura = (Math.sin(time / 3600) + 1) / 2
		if (map.getLayer("kusheshwar-focus-aura")) {
			map.setPaintProperty(
				"kusheshwar-focus-aura",
				"line-width",
				24 + aura * 10,
			)
			map.setPaintProperty(
				"kusheshwar-focus-aura",
				"line-opacity",
				0.12 + aura * 0.12,
			)
		}
		if (map.getLayer("kusheshwar-focus-bloom")) {
			map.setPaintProperty(
				"kusheshwar-focus-bloom",
				"line-width",
				14 + slow * 6,
			)
			map.setPaintProperty(
				"kusheshwar-focus-bloom",
				"line-opacity",
				0.24 + slow * 0.18,
			)
		}
		if (map.getLayer("kusheshwar-focus-glow")) {
			map.setPaintProperty(
				"kusheshwar-focus-glow",
				"line-opacity",
				0.48 + slow * 0.22,
			)
		}

		// Subtle breath on each intelligence sector glow (only if currently visible).
		const sectorBreath = 0.14 + cool * 0.1
		for (const id of sectorGlows) {
			if (
				map.getLayer(id) &&
				map.getLayoutProperty(id, "visibility") !== "none"
			) {
				map.setPaintProperty(id, "line-opacity", sectorBreath)
			}
		}

		frame = requestAnimationFrame(tick)
	}

	frame = requestAnimationFrame(tick)
	return () => cancelAnimationFrame(frame)
}
