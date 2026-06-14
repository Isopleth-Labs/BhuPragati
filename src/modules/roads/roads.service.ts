import data from './data/roadData.json';
import type { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';

export const RoadsService = {
  getData(): FeatureCollection<Geometry, GeoJsonProperties> {
    return data as FeatureCollection<Geometry, GeoJsonProperties>;
  }
}
