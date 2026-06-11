import data from './data/commandCenter.json';
import type { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';

export class CommandCenterService {
  static getCenter(): FeatureCollection<Geometry, GeoJsonProperties> {
    return data as FeatureCollection<Geometry, GeoJsonProperties>;
  }
}
