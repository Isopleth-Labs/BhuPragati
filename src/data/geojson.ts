const collection = (features) => ({
	type: "FeatureCollection",
	features,
});

const createOrganicBoundary = () => {
	const center = [86.27, 25.835];
	const coordinates = [];
	const samples = 96;

	for (let index = 0; index < samples; index += 1) {
		const angle = (Math.PI * 2 * index) / samples;
		const harmonic =
			1 +
			Math.sin(angle * 3.1 + 0.4) * 0.075 +
			Math.cos(angle * 5.2 - 0.8) * 0.055 +
			Math.sin(angle * 9.4 + 1.8) * 0.032 +
			Math.cos(angle * 17.6) * 0.018;

		const eastWestBias = 1 + Math.cos(angle - 0.18) * 0.08;
		const northSouthBias = 1 + Math.sin(angle + 0.55) * 0.06;
		const lonRadius = 0.195 * harmonic * eastWestBias;
		const latRadius = 0.13 * harmonic * northSouthBias;

		coordinates.push([
			Number((center[0] + Math.cos(angle) * lonRadius).toFixed(6)),
			Number((center[1] + Math.sin(angle) * latRadius).toFixed(6)),
		]);
	}

	coordinates.push(coordinates[0]);
	return coordinates;
};

export const administrativeBoundaries = collection([
	{
		type: "Feature",
		properties: {
			id: "darbhanga-district",
			boundaryType: "district",
			title: "Darbhanga District Boundary",
			label: "Darbhanga",
			status: "Administrative perimeter",
			metric: "North Bihar intelligence frame",
			note: "District-scale context boundary for infrastructure analysis.",
		},
		geometry: {
			type: "Polygon",
			coordinates: [
				[
					[85.66, 26.42],
					[85.9, 26.53],
					[86.22, 26.49],
					[86.48, 26.35],
					[86.61, 26.1],
					[86.54, 25.9],
					[86.31, 25.73],
					[85.98, 25.77],
					[85.71, 25.93],
					[85.58, 26.18],
					[85.66, 26.42],
				],
			],
		},
	},
	{
		type: "Feature",
		properties: {
			id: "kusheshwar-focus",
			boundaryType: "focus",
			title: "Kusheshwar Asthan Focus Zone",
			label: "Kusheshwar Asthan",
			status: "Priority command zone",
			metric: "Wetland, agriculture and access interface",
			note: "Local operating envelope centered on Kusheshwar Asthan and nearby waterlogged settlements.",
		},
		geometry: {
			type: "Polygon",
			coordinates: [createOrganicBoundary()],
		},
	},
]);

export const commandCenter = collection([
	{
		type: "Feature",
		properties: {
			title: "Kusheshwar Asthan Node",
			status: "Regional command center",
			metric: "25.796 N, 86.285 E",
			note: "Primary reference point for the dashboard viewport.",
		},
		geometry: {
			type: "Point",
			coordinates: [86.285, 25.796],
		},
	},
]);

export const analysisGrid = collection([
	{
		type: "Feature",
		properties: { title: "Northing Scanline", status: "GIS reference grid" },
		geometry: {
			type: "LineString",
			coordinates: [
				[85.72, 25.78],
				[86.48, 25.78],
			],
		},
	},
	{
		type: "Feature",
		properties: { title: "Northing Scanline", status: "GIS reference grid" },
		geometry: {
			type: "LineString",
			coordinates: [
				[85.72, 25.88],
				[86.48, 25.88],
			],
		},
	},
	{
		type: "Feature",
		properties: { title: "Northing Scanline", status: "GIS reference grid" },
		geometry: {
			type: "LineString",
			coordinates: [
				[85.72, 25.98],
				[86.48, 25.98],
			],
		},
	},
	{
		type: "Feature",
		properties: { title: "Easting Scanline", status: "GIS reference grid" },
		geometry: {
			type: "LineString",
			coordinates: [
				[86.0, 25.72],
				[86.0, 26.08],
			],
		},
	},
	{
		type: "Feature",
		properties: { title: "Easting Scanline", status: "GIS reference grid" },
		geometry: {
			type: "LineString",
			coordinates: [
				[86.16, 25.72],
				[86.16, 26.08],
			],
		},
	},
	{
		type: "Feature",
		properties: { title: "Easting Scanline", status: "GIS reference grid" },
		geometry: {
			type: "LineString",
			coordinates: [
				[86.32, 25.72],
				[86.32, 26.08],
			],
		},
	},
]);

export const floodRiskData = collection([
	{
		type: "Feature",
		properties: {
			layer: "flood",
			title: "Kusheshwar Wetland Basin",
			status: "High flood retention",
			metric: "Risk index 88",
			note: "Waterlogged agricultural and wetland terrain requires seasonal access planning.",
			intensity: 88,
		},
		geometry: {
			type: "Polygon",
			coordinates: [
				[
					[86.16, 25.76],
					[86.32, 25.75],
					[86.39, 25.82],
					[86.35, 25.91],
					[86.2, 25.92],
					[86.09, 25.84],
					[86.16, 25.76],
				],
			],
		},
	},
	{
		type: "Feature",
		properties: {
			layer: "flood",
			title: "Bhadahar-Hirni Water Cluster",
			status: "Very high exposure",
			metric: "Risk index 92",
			note: "Cluster aligns with large recorded wetland patches in the block.",
			intensity: 92,
		},
		geometry: {
			type: "Polygon",
			coordinates: [
				[
					[86.22, 25.82],
					[86.32, 25.81],
					[86.36, 25.88],
					[86.29, 25.94],
					[86.2, 25.91],
					[86.18, 25.86],
					[86.22, 25.82],
				],
			],
		},
	},
	{
		type: "Feature",
		properties: {
			layer: "flood",
			title: "Hirni Wetland Signal",
			status: "Major wetland",
			metric: "237.86 ha",
			note: "Ground-truthed wetland point used as flood-intelligence signal.",
			areaHa: 237.86,
		},
		geometry: { type: "Point", coordinates: [86.30168, 25.83103] },
	},
	{
		type: "Feature",
		properties: {
			layer: "flood",
			title: "Bhadahar Wetland Signal",
			status: "Major wetland",
			metric: "409.64 ha",
			note: "Ground-truthed wetland point used as flood-intelligence signal.",
			areaHa: 409.64,
		},
		geometry: { type: "Point", coordinates: [86.29812, 25.87684] },
	},
	{
		type: "Feature",
		properties: {
			layer: "flood",
			title: "Beri Wetland Signal",
			status: "Local retention",
			metric: "69.74 ha",
			note: "Wetland-edge settlement signal in the Kusheshwar Asthan block.",
			areaHa: 69.74,
		},
		geometry: { type: "Point", coordinates: [86.27441, 25.85084] },
	},
]);

export const roadData = collection([
	{
		type: "Feature",
		properties: {
			layer: "roads",
			title: "Darbhanga-Biraul-Kusheshwar Corridor",
			status: "Primary access spine",
			metric: "62 km district linkage",
			note: "Main movement path for referral, supplies and administration.",
			criticality: 72,
		},
		geometry: {
			type: "LineString",
			coordinates: [
				[85.9, 26.16],
				[86.0, 26.08],
				[86.08, 25.96],
				[86.18, 25.86],
				[86.285, 25.796],
			],
		},
	},
	{
		type: "Feature",
		properties: {
			layer: "roads",
			title: "Eastern Rural Access Loop",
			status: "Flood-season constraint",
			metric: "Last-mile vulnerability",
			note: "Local route pressure rises during monsoon waterlogging.",
			criticality: 81,
		},
		geometry: {
			type: "LineString",
			coordinates: [
				[86.285, 25.796],
				[86.36, 25.82],
				[86.42, 25.88],
				[86.39, 25.94],
			],
		},
	},
	{
		type: "Feature",
		properties: {
			layer: "roads",
			title: "Biraul Junction",
			status: "Referral route hinge",
			metric: "Traffic dependency point",
			note: "Failure or flooding here affects care and supply chains.",
			criticality: 78,
		},
		geometry: { type: "Point", coordinates: [86.08, 25.96] },
	},
	{
		type: "Feature",
		properties: {
			layer: "roads",
			title: "Kusheshwar Last-mile Node",
			status: "Critical local access",
			metric: "High monsoon sensitivity",
			note: "Priority node for all-weather strengthening.",
			criticality: 86,
		},
		geometry: { type: "Point", coordinates: [86.285, 25.796] },
	},
]);

export const healthcareData = collection([
	{
		type: "Feature",
		properties: {
			layer: "healthcare",
			title: "Kusheshwar Asthan Primary Care",
			status: "Local first response",
			metric: "Moderate access",
			note: "Anchor point for primary health coverage in the focus zone.",
			capacity: 56,
		},
		geometry: { type: "Point", coordinates: [86.285, 25.798] },
	},
	{
		type: "Feature",
		properties: {
			layer: "healthcare",
			title: "Harinagar Outreach Cluster",
			status: "Coverage gap",
			metric: "Mobile service priority",
			note: "Wetland-side settlements need mobile and seasonal access planning.",
			capacity: 42,
		},
		geometry: { type: "Point", coordinates: [86.24456, 25.86006] },
	},
	{
		type: "Feature",
		properties: {
			layer: "healthcare",
			title: "Biraul Referral Interface",
			status: "Referral support",
			metric: "Route-dependent",
			note: "Supports escalation toward Darbhanga when roads remain passable.",
			capacity: 63,
		},
		geometry: { type: "Point", coordinates: [86.08, 25.96] },
	},
]);

export const agricultureData = collection([
	{
		type: "Feature",
		properties: {
			layer: "agriculture",
			title: "Wetland-Edge Paddy Belt",
			status: "Very high dependency",
			metric: "Agri load 94",
			note: "Seasonal cropping decisions are tightly coupled to flood storage.",
			intensity: 94,
		},
		geometry: {
			type: "Polygon",
			coordinates: [
				[
					[86.1, 25.83],
					[86.22, 25.8],
					[86.27, 25.88],
					[86.2, 25.97],
					[86.08, 25.92],
					[86.1, 25.83],
				],
			],
		},
	},
	{
		type: "Feature",
		properties: {
			layer: "agriculture",
			title: "Eastern Cropping Pocket",
			status: "High input sensitivity",
			metric: "Agri load 87",
			note: "Rural energy and road reliability influence crop movement.",
			intensity: 87,
		},
		geometry: {
			type: "Polygon",
			coordinates: [
				[
					[86.28, 25.75],
					[86.43, 25.8],
					[86.43, 25.9],
					[86.34, 25.94],
					[86.26, 25.86],
					[86.28, 25.75],
				],
			],
		},
	},
]);

export const electricityData = collection([
	{
		type: "Feature",
		properties: {
			layer: "electricity",
			title: "Biraul-Kusheshwar Feeder",
			status: "Stability watch",
			metric: "Feeder stress 68",
			note: "Rural load centers require hardened feeder continuity.",
			stress: 68,
		},
		geometry: {
			type: "LineString",
			coordinates: [
				[86.04, 25.99],
				[86.12, 25.92],
				[86.2, 25.86],
				[86.285, 25.796],
			],
		},
	},
	{
		type: "Feature",
		properties: {
			layer: "electricity",
			title: "Eastern Service Spur",
			status: "Outage sensitivity",
			metric: "Feeder stress 74",
			note: "Distributed settlements increase restoration complexity.",
			stress: 74,
		},
		geometry: {
			type: "LineString",
			coordinates: [
				[86.285, 25.796],
				[86.34, 25.84],
				[86.4, 25.88],
			],
		},
	},
	{
		type: "Feature",
		properties: {
			layer: "electricity",
			title: "Biraul Substation Interface",
			status: "Supply anchor",
			metric: "Regional distribution node",
			note: "Key upstream node for the focus-zone feeder.",
			stress: 61,
		},
		geometry: { type: "Point", coordinates: [86.07, 25.965] },
	},
	{
		type: "Feature",
		properties: {
			layer: "electricity",
			title: "Kusheshwar Rural Load Center",
			status: "Priority hardening",
			metric: "Load sensitivity 77",
			note: "Local resilience improves continuity for healthcare and irrigation.",
			stress: 77,
		},
		geometry: { type: "Point", coordinates: [86.285, 25.796] },
	},
]);
