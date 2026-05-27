export const infrastructureLayers = [
  {
    id: "flood",
    label: "Flood Risk",
    shortLabel: "Flood",
    status: "High",
    score: 84,
    trend: "Wetland saturation",
    color: "#ff4438",
    mapLayerIds: [
      "flood-risk-glow",
      "flood-risk-fill",
      "flood-risk-outline",
      "flood-wetland-points",
    ],
    summary:
      "Low-lying wetland belts and river confluences create recurring monsoon exposure around Kusheshwar Asthan.",
  },
  {
    id: "roads",
    label: "Roads",
    shortLabel: "Road",
    status: "Fragile",
    score: 46,
    trend: "Last-mile exposure",
    color: "#ffb020",
    mapLayerIds: ["road-corridor-glow", "road-corridors", "road-critical-nodes"],
    summary:
      "Strategic corridors are vulnerable where access crosses waterlogged agricultural pockets.",
  },
  {
    id: "healthcare",
    label: "Healthcare",
    shortLabel: "Care",
    status: "Moderate",
    score: 57,
    trend: "Referral distance",
    color: "#3c8cff",
    mapLayerIds: ["healthcare-access-halos", "healthcare-access-points"],
    summary:
      "Primary care coverage depends on reliable referral movement toward Biraul and Darbhanga.",
  },
  {
    id: "agriculture",
    label: "Agriculture",
    shortLabel: "Agri",
    status: "Very High",
    score: 91,
    trend: "Paddy dependency",
    color: "#3cff8f",
    mapLayerIds: ["agriculture-belts-fill", "agriculture-belts-outline"],
    summary:
      "Dense paddy and wetland-edge farming dominate local livelihoods and water sensitivity.",
  },
  {
    id: "electricity",
    label: "Electricity",
    shortLabel: "Power",
    status: "Unstable",
    score: 49,
    trend: "Feeder stress",
    color: "#bf5cff",
    mapLayerIds: [
      "electricity-feeder-glow",
      "electricity-feeders",
      "electricity-assets",
    ],
    summary:
      "Feeder resilience is constrained by flood-prone access and dispersed rural load centers.",
  },
];

export const operationalStats = [
  { label: "Command Zone", value: "Kusheshwar Asthan" },
  { label: "District", value: "Darbhanga" },
  { label: "PIN", value: "848213" },
  { label: "Mode", value: "Live GIS" },
];

export const systemReadouts = [
  { label: "Flood Exposure", value: "84", unit: "/100" },
  { label: "Road Continuity", value: "46", unit: "/100" },
  { label: "Care Reach", value: "57", unit: "/100" },
  { label: "Agri Load", value: "91", unit: "/100" },
  { label: "Power Stability", value: "49", unit: "/100" },
];
