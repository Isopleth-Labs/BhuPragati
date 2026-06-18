import type { FeatureCollection, GeoJsonProperties, Geometry } from "geojson"
import data from "./data/commandCenter.json"

export const CommandCenterService = {
	getCenter(): FeatureCollection<Geometry, GeoJsonProperties> {
		return data as FeatureCollection<Geometry, GeoJsonProperties>
	},
}
