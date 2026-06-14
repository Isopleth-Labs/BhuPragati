import { SettlementsService } from "./SettlementsService.getSettlements().service";
import { addLayer, addSource } from "@/shared";

export function addRegionalOverlays(map: Map) {
	addHydrology(map);
	addInfrastructureNodes(map);
	addSettlements(map);
}

function addHydrology(map: Map) {
	addSource(map, "regional-rivers", SettlementsService.getRegionalRivers());

	addLayer(map, {
		id: "region-river-glow",
		type: "line",
		source: "regional-rivers",
		paint: {
			"line-color": "#6cb9e6",
			"line-width": ["interpolate", ["linear"], ["zoom"], 8, 4, 12, 10, 15, 18],
			"line-blur": 7,
			"line-opacity": 0.3,
		},
		layout: { "line-cap": "round", "line-join": "round" },
	});

	addLayer(map, {
		id: "region-river-core",
		type: "line",
		source: "regional-rivers",
		paint: {
			"line-color": "rgba(180, 220, 244, 0.88)",
			"line-width": [
				"interpolate",
				["linear"],
				["zoom"],
				8,
				0.8,
				12,
				1.8,
				15,
				3.2,
			],
			"line-blur": 0.4,
			"line-opacity": 0.92,
		},
		layout: { "line-cap": "round", "line-join": "round" },
	});
}

function addSettlements(map: Map) {
	addSource(
		map,
		"regional-SettlementsService.getSettlements()",
		SettlementsService.getSettlements(),
	);

	addLayer(map, {
		id: "region-settlement-dots",
		type: "circle",
		source: "regional-SettlementsService.getSettlements()",
		paint: {
			"circle-radius": [
				"match",
				["get", "tier"],
				"city",
				5.4,
				"town",
				3.6,
				2.4,
			],
			"circle-color": [
				"match",
				["get", "tier"],
				"city",
				"#ffffff",
				"town",
				"#dde7f4",
				"#a8b8cc",
			],
			"circle-opacity": [
				"match",
				["get", "tier"],
				"city",
				0.95,
				"town",
				0.85,
				0.7,
			],
			"circle-stroke-color": "rgba(120, 180, 220, 0.55)",
			"circle-stroke-width": 1,
		},
	});

	addLayer(map, {
		id: "region-settlement-labels",
		type: "symbol",
		source: "regional-SettlementsService.getSettlements()",
		layout: {
			"text-field": ["get", "name"],
			"text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
			"text-size": [
				"match",
				["get", "tier"],
				"city",
				["interpolate", ["linear"], ["zoom"], 8, 14, 11, 22, 13, 28],
				"town",
				["interpolate", ["linear"], ["zoom"], 9, 11, 12, 14, 14, 17],
				["interpolate", ["linear"], ["zoom"], 11, 9, 13, 11, 15, 13],
			],
			"text-letter-spacing": [
				"match",
				["get", "tier"],
				"city",
				0.06,
				"town",
				0.04,
				0.02,
			],
			"text-offset": [0, 1.2],
			"text-anchor": "top",
			"text-padding": 5,
			"text-allow-overlap": false,
			"symbol-sort-key": ["match", ["get", "tier"], "city", 1, "town", 2, 3],
		},
		paint: {
			"text-color": [
				"match",
				["get", "tier"],
				"city",
				"rgba(255, 255, 255, 0.96)",
				"town",
				"rgba(225, 235, 250, 0.85)",
				"rgba(190, 205, 225, 0.7)",
			],
			"text-halo-color": "rgba(4, 10, 18, 0.92)",
			"text-halo-width": [
				"match",
				["get", "tier"],
				"city",
				2,
				"town",
				1.4,
				1.1,
			],
			"text-halo-blur": 1.4,
		},
	});
}

const NODE_COLORS = [
	"match",
	["get", "nodeType"],
	"hospital",
	"#ff6f6f",
	"police",
	"#7fbcff",
	"electrical",
	"#ffb84d",
	"rail",
	"#c69cff",
	"bridge",
	"#9ad8c4",
	"#aabacc",
];

const NODE_DOT_COLORS = [
	"match",
	["get", "nodeType"],
	"hospital",
	"#ff8a85",
	"police",
	"#8fc4ff",
	"electrical",
	"#ffc870",
	"rail",
	"#d3afff",
	"bridge",
	"#a8e0cc",
	"#bccada",
];

function addInfrastructureNodes(map: Map) {
	addSource(map, "regional-pois", SettlementsService.getInfrastructureNodes());

	addLayer(map, {
		id: "region-poi-glow",
		type: "circle",
		source: "regional-pois",
		paint: {
			"circle-radius": 11,
			"circle-color": NODE_COLORS,
			"circle-opacity": 0.18,
			"circle-blur": 0.9,
		},
	});

	addLayer(map, {
		id: "region-poi-dots",
		type: "circle",
		source: "regional-pois",
		paint: {
			"circle-radius": 3.4,
			"circle-color": NODE_DOT_COLORS,
			"circle-stroke-color": "rgba(255, 255, 255, 0.85)",
			"circle-stroke-width": 1,
			"circle-stroke-opacity": 0.7,
		},
	});

	addLayer(map, {
		id: "region-poi-symbol",
		type: "symbol",
		source: "regional-pois",
		layout: {
			"text-field": ["get", "symbol"],
			"text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
			"text-size": 9,
			"text-offset": [0, -1.2],
			"text-anchor": "bottom",
			"text-padding": 3,
			"text-letter-spacing": 0.08,
		},
		paint: {
			"text-color": "rgba(225, 235, 250, 0.88)",
			"text-halo-color": "rgba(4, 10, 18, 0.92)",
			"text-halo-width": 1.3,
			"text-halo-blur": 1,
		},
	});
}
