import data from './data/administrativeBoundaries.json';
import type { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';

export class AdministrativeService {
  static getBoundaries(): FeatureCollection<Geometry, GeoJsonProperties> {
    return data as FeatureCollection<Geometry, GeoJsonProperties>;
  }
}
