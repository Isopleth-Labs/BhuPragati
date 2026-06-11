// Real-world geographic intelligence for the Kusheshwar Asthan
// floodplain region (Darbhanga / Samastipur / Khagaria / Madhubani belt).
//
// Coordinates are research-grade approximations sourced from public
// OpenStreetMap references, sufficient for tactical visualization at
// the dashboard's working zoom range (8.8 – 15.5).

import type { FeatureCollection, GeoJsonProperties, LineString, Point } from "geojson";

import settlementsJson from "./settlements.json";
import regionalRiversJson from "./regionalRivers.json";
import infrastructureNodesJson from "./infrastructureNodes.json";

// --- SETTLEMENTS -------------------------------------------------------
// tier: "city" (district HQ) | "town" (block HQ) | "village" (notable settlement)
export const settlements: FeatureCollection<Point, GeoJsonProperties> = settlementsJson as FeatureCollection<Point, GeoJsonProperties>;

// --- HYDROLOGY ---------------------------------------------------------
// Major distributaries and rivers of the north Bihar floodplain.
// Polylines approximate the channel centerlines at low/medium zoom.
export const regionalRivers: FeatureCollection<LineString, GeoJsonProperties> = regionalRiversJson as FeatureCollection<LineString, GeoJsonProperties>;

// --- INFRASTRUCTURE NODES ---------------------------------------------
// nodeType controls icon color + letter symbol on the map.
export const infrastructureNodes: FeatureCollection<Point, GeoJsonProperties> = infrastructureNodesJson as FeatureCollection<Point, GeoJsonProperties>;
