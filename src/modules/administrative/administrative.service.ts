import data from "./data/administrativeBoundaries.json";
import type { FeatureCollection, Geometry, GeoJsonProperties } from "geojson";

export const AdministrativeService = {
	getBoundaries(): FeatureCollection<Geometry, GeoJsonProperties> {
		return data as FeatureCollection<Geometry, GeoJsonProperties>;
	},
};
