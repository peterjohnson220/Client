import {
  ExchangeMapResponse,
  generateMockExchangeMapResponse,
  generateMockGeoCoordinates,
  GeoCoordinates
} from '../exchange-map-response.model';

export interface PeerMapScopeMapInfo {
  ScopeTopLeft: GeoCoordinates;
  ScopeBottomRight: GeoCoordinates;
  MapResponse: ExchangeMapResponse;
  ClusterPrecision: number;
  ZoomLevel: number;
}

export function generateMockPeerMapScopeMapInfo(): PeerMapScopeMapInfo {
  return {
    ScopeTopLeft: generateMockGeoCoordinates(),
    ScopeBottomRight: generateMockGeoCoordinates(),
    MapResponse: generateMockExchangeMapResponse(),
    ClusterPrecision: 0,
    ZoomLevel: 0
  };
}
