// Centralized infrastructure layer registry.
// Each entry maps a logical infrastructure layer to its MapLibre layer ids
// (used for visibility toggling and lazy overlay loading).

import { layerColors } from "../../styles/theme";
import type { InfrastructureLayer } from "@/shared/types";

export const infrastructureLayers: InfrastructureLayer[] = [
	{
		id: "flood",
		iconKey: "flood",
		label: "Flood Risk",
		shortLabel: "Flood",
		intelligenceLabel: "Flood Intelligence",
		scoreLabel: "Flood Risk",
		legendLabel: "Flood Prone Area",
		status: "High",
		verdict: "High",
		unitNote: "risk level",
		score: 84,
		trend: "Wetland saturation",
		color: layerColors.flood,
		overlay: "flood",
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
		iconKey: "roads",
		label: "Roads",
		shortLabel: "Road",
		intelligenceLabel: "Road Connectivity",
		scoreLabel: "Road Access",
		legendLabel: "Weak Road Connectivity",
		status: "Fragile",
		verdict: "Weak",
		unitNote: "level",
		score: 46,
		trend: "Last-mile exposure",
		color: layerColors.roads,
		overlay: "road",
		mapLayerIds: [
			"road-corridor-glow",
			"road-corridors",
			"road-critical-nodes",
		],
		summary:
			"Strategic corridors are vulnerable where access crosses waterlogged agricultural pockets.",
	},
	{
		id: "healthcare",
		iconKey: "healthcare",
		label: "Healthcare",
		shortLabel: "Care",
		intelligenceLabel: "Healthcare Access",
		scoreLabel: "Healthcare",
		legendLabel: "Healthcare Gap",
		status: "Moderate",
		verdict: "Moderate",
		unitNote: "level",
		score: 57,
		trend: "Referral distance",
		color: layerColors.healthcare,
		overlay: "healthcare",
		mapLayerIds: ["healthcare-access-halos", "healthcare-access-points"],
		summary:
			"Primary care coverage depends on reliable referral movement toward Biraul and Darbhanga.",
	},
	{
		id: "agriculture",
		iconKey: "agriculture",
		label: "Agriculture",
		shortLabel: "Agri",
		intelligenceLabel: "Agriculture Dependency",
		scoreLabel: "Agriculture",
		legendLabel: "High Agriculture Dependency",
		status: "Very High",
		verdict: "Very High",
		unitNote: "level",
		score: 91,
		trend: "Paddy dependency",
		color: layerColors.agriculture,
		overlay: "agriculture",
		mapLayerIds: ["agriculture-belts-fill", "agriculture-belts-outline"],
		summary:
			"Dense paddy and wetland-edge farming dominate local livelihoods and water sensitivity.",
	},
	{
		id: "electricity",
		iconKey: "electricity",
		label: "Electricity",
		shortLabel: "Power",
		intelligenceLabel: "Electricity Stability",
		scoreLabel: "Electricity",
		legendLabel: "Electricity Instability",
		status: "Unstable",
		verdict: "Low",
		unitNote: "level",
		score: 49,
		trend: "Feeder stress",
		color: layerColors.electricity,
		overlay: "electricity",
		mapLayerIds: [
			"electricity-feeder-glow",
			"electricity-feeders",
			"electricity-assets",
		],
		summary:
			"Feeder resilience is constrained by flood-prone access and dispersed rural load centers.",
	},
];

export const interactiveLayerIds = [
	"darbhanga-district-line",
	"kusheshwar-focus-core",
	"flood-risk-fill",
	"flood-wetland-points",
	"road-corridors",
	"road-critical-nodes",
	"healthcare-access-points",
	"agriculture-belts-fill",
	"electricity-feeders",
	"electricity-assets",
];

import systemReadoutsJson from "../../../data/systemReadouts.json";

export const systemReadouts = systemReadoutsJson;
