// Real-world geographic intelligence for the Kusheshwar Asthan
// floodplain region (Darbhanga / Samastipur / Khagaria / Madhubani belt).
//
// Coordinates are research-grade approximations sourced from public
// OpenStreetMap references, sufficient for tactical visualization at
// the dashboard's working zoom range (8.8 – 15.5).

const f = (lng, lat, properties) => ({
  type: "Feature",
  properties,
  geometry: { type: "Point", coordinates: [lng, lat] },
});

const line = (coords, properties) => ({
  type: "Feature",
  properties,
  geometry: { type: "LineString", coordinates: coords },
});

// --- SETTLEMENTS -------------------------------------------------------
// tier: "city" (district HQ) | "town" (block HQ) | "village" (notable settlement)

export const settlements = {
  type: "FeatureCollection",
  features: [
    // District headquarters (cities)
    f(85.897, 26.152, { name: "Darbhanga", tier: "city" }),
    f(86.073, 26.349, { name: "Madhubani", tier: "city" }),
    f(85.781, 25.864, { name: "Samastipur", tier: "city" }),
    f(86.609, 26.124, { name: "Supaul", tier: "city" }),
    f(86.483, 25.502, { name: "Khagaria", tier: "city" }),

    // Block headquarters / towns
    f(86.378, 26.052, { name: "Biraul", tier: "town" }),
    f(86.030, 25.745, { name: "Rosera", tier: "town" }),
    f(86.180, 25.745, { name: "Hasanpur", tier: "town" }),
    f(86.285, 25.796, { name: "Kusheshwar Asthan", tier: "town" }),
    f(85.953, 26.078, { name: "Bahadurpur", tier: "town" }),

    // Notable villages within / around the focus zone
    f(86.355, 25.835, { name: "Kusheshwar Asthan Purbi", tier: "village" }),
    f(86.302, 25.913, { name: "Ghanshyampur", tier: "village" }),
    f(86.050, 25.800, { name: "Singhia", tier: "village" }),
    f(86.058, 25.930, { name: "Baheri", tier: "village" }),
    f(86.328, 25.555, { name: "Alauli", tier: "village" }),
    f(86.250, 25.860, { name: "Tilkeswar", tier: "village" }),
    f(86.230, 25.740, { name: "Manigachhi", tier: "village" }),
  ],
};

// --- HYDROLOGY ---------------------------------------------------------
// Major distributaries and rivers of the north Bihar floodplain.
// Polylines approximate the channel centerlines at low/medium zoom.

export const regionalRivers = {
  type: "FeatureCollection",
  features: [
    line(
      [
        [85.85, 26.05],
        [85.98, 25.96],
        [86.12, 25.88],
        [86.24, 25.82],
        [86.34, 25.78],
        [86.46, 25.71],
        [86.58, 25.6],
      ],
      { name: "Kosi (distributary)", classification: "river" },
    ),
    line(
      [
        [85.92, 26.4],
        [86.0, 26.22],
        [86.08, 26.05],
        [86.18, 25.88],
        [86.26, 25.72],
        [86.34, 25.56],
      ],
      { name: "Kamla Balan", classification: "river" },
    ),
    line(
      [
        [85.6, 26.45],
        [85.75, 26.2],
        [85.82, 26.0],
        [85.86, 25.8],
        [85.92, 25.6],
      ],
      { name: "Bagmati", classification: "river" },
    ),
    line(
      [
        [86.05, 25.88],
        [86.18, 25.84],
        [86.3, 25.82],
        [86.42, 25.78],
      ],
      { name: "Kareh", classification: "distributary" },
    ),
  ],
};

// --- INFRASTRUCTURE NODES ---------------------------------------------
// nodeType controls icon color + letter symbol on the map.

export const infrastructureNodes = {
  type: "FeatureCollection",
  features: [
    f(85.91, 26.155, {
      name: "Darbhanga Medical College Hospital",
      nodeType: "hospital",
      symbol: "H",
    }),
    f(85.783, 25.865, {
      name: "Sadar Hospital Samastipur",
      nodeType: "hospital",
      symbol: "H",
    }),
    f(86.075, 26.345, {
      name: "Madhubani Sadar Hospital",
      nodeType: "hospital",
      symbol: "H",
    }),
    f(86.29, 25.795, {
      name: "Kusheshwar Asthan Police Station",
      nodeType: "police",
      symbol: "P",
    }),
    f(86.38, 26.05, {
      name: "Biraul Police Station",
      nodeType: "police",
      symbol: "P",
    }),
    f(86.38, 26.058, {
      name: "Biraul 33 kV Substation",
      nodeType: "electrical",
      symbol: "S",
    }),
    f(85.895, 26.148, {
      name: "Darbhanga Junction",
      nodeType: "rail",
      symbol: "R",
    }),
    f(85.78, 25.86, {
      name: "Samastipur Junction",
      nodeType: "rail",
      symbol: "R",
    }),
    f(86.305, 25.81, {
      name: "Kosi Embankment Bridge",
      nodeType: "bridge",
      symbol: "B",
    }),
    f(86.18, 25.86, {
      name: "Kamla Bridge (NH-527E)",
      nodeType: "bridge",
      symbol: "B",
    }),
  ],
};
