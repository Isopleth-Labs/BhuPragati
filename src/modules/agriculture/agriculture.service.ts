import data from './data/agricultureData.json';
import type { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';

export const AgricultureService = {
  getData(): FeatureCollection<Geometry, GeoJsonProperties> {
    return data as FeatureCollection<Geometry, GeoJsonProperties>;
  }
}
