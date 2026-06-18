import type { FeatureCollection, GeoJsonProperties, Geometry } from "geojson"
import data from "./data/roadData.json"

export const RoadsService = {
	getData(): FeatureCollection<Geometry, GeoJsonProperties> {
		return data as FeatureCollection<Geometry, GeoJsonProperties>
	},
}
