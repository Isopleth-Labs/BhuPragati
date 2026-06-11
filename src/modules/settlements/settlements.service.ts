import infrastructureNodesData from './data/infrastructureNodes.json';
import regionalRiversData from './data/regionalRivers.json';
import settlementsData from './data/settlements.json';
import type { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';

export class SettlementsService {
  static getInfrastructureNodes(): FeatureCollection<Geometry, GeoJsonProperties> {
    return infrastructureNodesData as FeatureCollection<Geometry, GeoJsonProperties>;
  }
  static getRegionalRivers(): FeatureCollection<Geometry, GeoJsonProperties> {
    return regionalRiversData as FeatureCollection<Geometry, GeoJsonProperties>;
  }
  static getSettlements(): FeatureCollection<Geometry, GeoJsonProperties> {
    return settlementsData as FeatureCollection<Geometry, GeoJsonProperties>;
  }
}
