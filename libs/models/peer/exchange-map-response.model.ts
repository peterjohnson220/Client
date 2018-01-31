export interface ExchangeMapResponse {
  MapSummary: ExchangeMapSummary;
  MapChunks: MapChunk[];
}

export function generateMockExchangeMapResponse(): ExchangeMapResponse {
  return {
    MapSummary: generateMockExchangeMapSummary(),
    MapChunks: [generateMockMapChunk()]
  };
}

export interface ExchangeMapSummary {
  OverallMapStats: AreaStats;
  TopLeft: GeoCoordinates;
  BottomRight: GeoCoordinates;
  Center: GeoCoordinates;
}

export function generateMockExchangeMapSummary(): ExchangeMapSummary {
  return {
    OverallMapStats: generateMockAreaStats(),
    TopLeft: generateMockGeoCoordinates(),
    BottomRight: generateMockGeoCoordinates(),
    Center: generateMockGeoCoordinates()
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
  Stats: DimensionStats[];
  Companies: ExchangeStatCompanyMakeup[];
}

export function generateMockAreaStats(): AreaStats {
  return {
    SalaryCount: 1,
    Stats: [generateMockDimensionStats()],
    Companies: [generateMockExchangeStatCompanyMakeup()]
  };
}

export interface ExchangeStatCompanyMakeup {
  Company: string;
  Count: number;
  Percentage: number;
}

export function generateMockExchangeStatCompanyMakeup(): ExchangeStatCompanyMakeup {
  return {
    Company: 'MockCompany',
    Count: 1,
    Percentage: 0.1
  };
}

export interface DimensionStats {
  Dimension: string;
  Minimum: number;
  Maximum: number;
  Average: number;
  Percentile25: number;
  Percentile50: number;
  Percentile75: number;
}

export function generateMockDimensionStats(): DimensionStats {
  return {
    Dimension: 'MockDimension',
    Minimum: 0,
    Maximum: 1,
    Average: 0.5,
    Percentile25: 25,
    Percentile50: 50,
    Percentile75: 75
  };
}
