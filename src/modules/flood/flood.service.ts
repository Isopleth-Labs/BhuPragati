import type { FeatureCollection, GeoJsonProperties, Geometry } from "geojson"
import data from "./data/floodRiskData.json"

export const FloodService = {
	getRiskData(): FeatureCollection<Geometry, GeoJsonProperties> {
		return data as FeatureCollection<Geometry, GeoJsonProperties>
	},
}
