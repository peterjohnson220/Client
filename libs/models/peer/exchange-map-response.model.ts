import { Feature, Point } from 'geojson';

export interface ExchangeMapResponse {
  MapSummary: ExchangeMapSummary;
  MapChunks: MapChunk[];
  FeatureCollection: Feature<Point>[];
}

export function generateMockExchangeMapResponse(): ExchangeMapResponse {
  return {
    MapSummary: generateMockExchangeMapSummary(),
    MapChunks: [generateMockMapChunk()],
    FeatureCollection: []
  };
}

export interface ExchangeMapSummary {
  OverallMapStats: AreaStats;
  TopLeft: GeoCoordinates;
  BottomRight: GeoCoordinates;
  Centroid: GeoCoordinates;
}

export function generateMockExchangeMapSummary(): ExchangeMapSummary {
  return {
    OverallMapStats: generateMockAreaStats(),
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
}

export function generateMockAreaStats(): AreaStats {
  return {
    SalaryCount: 1,
    CompanyCount: 1,
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
