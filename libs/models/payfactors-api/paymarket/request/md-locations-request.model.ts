import { MDScopeGeoGroup } from 'libs/constants';

export interface MDLocationsRequest {
  CountryCode: string;
  GeoLabel: MDScopeGeoGroup;
  Query: string;
}
