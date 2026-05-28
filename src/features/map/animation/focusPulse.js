// Subtle command-center pulse. Single rAF loop, gentle amplitude.

export function startFocusPulse(map) {
  let frame = 0;

  // Layers to gently breathe (intelligence sectors).
  const sectorGlows = [
    "flood-risk-glow",
    "road-corridor-glow",
    "electricity-feeder-glow",
  ];

  const tick = (time) => {
    const fast = (Math.sin(time / 1400) + 1) / 2;
    const slow = (Math.sin(time / 2400) + 1) / 2;
    const cool = (Math.sin(time / 3200) + 1) / 2;

    if (map.getLayer("command-halo-cool")) {
      map.setPaintProperty("command-halo-cool", "circle-radius", 80 + cool * 24);
      map.setPaintProperty("command-halo-cool", "circle-opacity", 0.04 + cool * 0.06);
    }

    if (map.getLayer("command-pulse-outer")) {
      map.setPaintProperty("command-pulse-outer", "circle-radius", 50 + slow * 18);
      map.setPaintProperty("command-pulse-outer", "circle-opacity", 0.05 + (1 - slow) * 0.08);
    }
    if (map.getLayer("command-pulse")) {
      map.setPaintProperty("command-pulse", "circle-radius", 26 + fast * 10);
      map.setPaintProperty("command-pulse", "circle-opacity", 0.1 + (1 - fast) * 0.14);
    }
    if (map.getLayer("command-ring")) {
      map.setPaintProperty("command-ring", "circle-stroke-opacity", 0.45 + fast * 0.3);
    }
    // Slow shimmer on outer aura (different phase for organic feel).
    const aura = (Math.sin(time / 3600) + 1) / 2;
    if (map.getLayer("kusheshwar-focus-aura")) {
      map.setPaintProperty("kusheshwar-focus-aura", "line-width", 44 + aura * 18);
      map.setPaintProperty("kusheshwar-focus-aura", "line-opacity", 0.05 + aura * 0.07);
    }
    if (map.getLayer("kusheshwar-focus-bloom")) {
      map.setPaintProperty("kusheshwar-focus-bloom", "line-width", 24 + slow * 12);
      map.setPaintProperty("kusheshwar-focus-bloom", "line-opacity", 0.14 + slow * 0.12);
    }
    if (map.getLayer("kusheshwar-focus-glow")) {
      map.setPaintProperty("kusheshwar-focus-glow", "line-opacity", 0.36 + slow * 0.18);
    }

    // Subtle breath on each intelligence sector glow (only if currently visible).
    const sectorBreath = 0.14 + cool * 0.1;
    for (const id of sectorGlows) {
      if (
        map.getLayer(id) &&
        map.getLayoutProperty(id, "visibility") !== "none"
      ) {
        map.setPaintProperty(id, "line-opacity", sectorBreath);
      }
    }

    frame = requestAnimationFrame(tick);
  };

  frame = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(frame);
}
