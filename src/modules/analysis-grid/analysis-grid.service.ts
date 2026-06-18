import type { FeatureCollection, GeoJsonProperties, Geometry } from "geojson"
import data from "./data/analysisGrid.json"

export const AnalysisGridService = {
	getGrid(): FeatureCollection<Geometry, GeoJsonProperties> {
		return data as FeatureCollection<Geometry, GeoJsonProperties>
	},
}
