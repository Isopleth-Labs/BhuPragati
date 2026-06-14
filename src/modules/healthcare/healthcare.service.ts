import type { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import data from "./data/healthcareData.json";

export const HealthcareService = {
	getData(): FeatureCollection<Geometry, GeoJsonProperties> {
		return data as FeatureCollection<Geometry, GeoJsonProperties>;
	},
};
