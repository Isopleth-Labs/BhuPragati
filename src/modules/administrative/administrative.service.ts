import type { FeatureCollection, GeoJsonProperties, Geometry } from "geojson"
import data from "./data/administrativeBoundaries.json"

export const AdministrativeService = {
	getBoundaries(): FeatureCollection<Geometry, GeoJsonProperties> {
		return data as FeatureCollection<Geometry, GeoJsonProperties>
	},
}
