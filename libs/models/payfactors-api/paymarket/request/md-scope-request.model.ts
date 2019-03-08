import { MDScopeGeoGroup } from 'libs/constants';

export interface MDScopeRequest {
  CountryCode: string;
  GeoLabels: MDScopeGeoGroup[];
}
