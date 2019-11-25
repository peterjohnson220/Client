import { Feature, Point } from 'geojson';

export interface ExchangeMapResponse {
  MapSummary: ExchangeMapSummary;
  FeatureCollection: Feature<Point>[];
}

export function generateMockExchangeMapResponse(): ExchangeMapResponse {
  return {
    MapSummary: generateMockExchangeMapSummary(),
    FeatureCollection: []
  };
}

export interface MapGeoData {
  TopLeft: GeoCoordinates;
  BottomRight: GeoCoordinates;
  Centroid: GeoCoordinates;
}

export interface ExchangeMapSummary extends MapGeoData {
  OverallMapStats: AreaStats;
}

export function generateMockExchangeMapSummary(): ExchangeMapSummary {
  return {
    OverallMapStats: generateMockAreaStats(),
    TopLeft: generateMockGeoCoordinates(),
    BottomRight: generateMockGeoCoordinates(),
    Centroid: generateMockGeoCoordinates()
  };
}

export function generateMockMapGeoData(): MapGeoData {
  return {
    TopLeft: generateMockGeoCoordinates(),
    BottomRight: generateMockGeoCoordinates(),
    Centroid: generateMockGeoCoordinates()
  };
}

export interface MapChunk {
  Id: number;
  Location: GeoCoordinates;
  Stats: AreaStats;
}

export function generateMockMapChunk(): MapChunk {
  return {
    Id: 1,
    Location: generateMockGeoCoordinates(),
    Stats: generateMockAreaStats()
  };
}

export interface GeoCoordinates {
  Lat: number;
  Lon: number;
}

export function generateMockGeoCoordinates(): GeoCoordinates {
  return {
    Lat: 0,
    Lon: 0
  };
}

export interface AreaStats {
  SalaryCount: number;
  CompanyCount: number;
  Companies: ExchangeStatCompanyMakeup[];
  ExchangeJobIds: number[];
  UntaggedIncumbentCount: number;
}

export function generateMockAreaStats(): AreaStats {
  return {
    SalaryCount: 1,
    CompanyCount: 1,
    UntaggedIncumbentCount: 0,
    Companies: [generateMockExchangeStatCompanyMakeup()],
    ExchangeJobIds: [1, 2]
  };
}

export interface ExchangeStatCompanyMakeup {
  Company: string;
  Count: number;
  CompanyId: number;
  Percentage: number;
}

export function generateMockExchangeStatCompanyMakeup(): ExchangeStatCompanyMakeup {
  return {
    Company: 'MockCompany',
    Count: 1,
    CompanyId: 1,
    Percentage: 0.1
  };
}
