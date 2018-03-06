import { generateMockGeoCoordinates, GeoCoordinates } from './exchange-map-response.model';

export interface ExchangeMapFilter {
  Exchanges: string[];
  States: string[];
  Cities: string[];
  Companies: string[];
  CompanyIndustries: string[];
  ExchangeJobFamilies: string[];
  ExchangeJobLevels: string[];
  ExchangeJobFLSAStatuses: string[];
  ExchangeJobIds: number[];
  TopLeft: GeoCoordinates;
  BottomRight: GeoCoordinates;
  ClusterPrecision: number;
}

export function generateMockExchangeMapFilter(): ExchangeMapFilter {
  return {
    Exchanges: ['ExchangeOne'],
    States: ['StateOne'],
    Cities: ['CityOne, StateOne'],
    Companies: ['MockCompany'],
    CompanyIndustries: ['MockCompanyIndustry'],
    ExchangeJobFamilies: ['MockExchangeJobFamily'],
    ExchangeJobLevels: ['MockExchangeJobLevel'],
    ExchangeJobFLSAStatuses: ['MockExchangeJobFLSAStatus'],
    ExchangeJobIds: [0],
    TopLeft: generateMockGeoCoordinates(),
    BottomRight: generateMockGeoCoordinates(),
    ClusterPrecision: 12
  };
}
