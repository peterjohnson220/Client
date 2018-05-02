import { generateMockGeoCoordinates, GeoCoordinates } from './exchange-map-response.model';
import { SystemFilter } from './exchange-job-pay-market-filter.model';
import { generateMockPayMarketLocation } from './pay-market-location.model';

export interface ExchangeDataSearchFilter extends SystemFilter {
  ExchangeIds: number[];
  States: string[];
  Cities: string[];
  CompanyIds: number[];
  CompanyIndustries: string[];
  ExchangeJobFamilies: string[];
  ExchangeJobLevels: string[];
  ExchangeJobFLSAStatuses: string[];
  TopLeft: GeoCoordinates;
  BottomRight: GeoCoordinates;
  ClusterPrecision: number;
}

export function generateMockExchangeMapFilter(): ExchangeDataSearchFilter {
  return {
    ExchangeJobIds: [1, 2, 4],
    PayMarketLocation: generateMockPayMarketLocation(),
    ExchangeId: 1,
    ExchangeIds: [1, 2],
    States: ['StateOne'],
    Cities: ['CityOne, StateOne'],
    CompanyIds: [2, 3],
    CompanyIndustries: ['MockCompanyIndustry'],
    ExchangeJobFamilies: ['MockExchangeJobFamily'],
    ExchangeJobLevels: ['MockExchangeJobLevel'],
    ExchangeJobFLSAStatuses: ['MockExchangeJobFLSAStatus'],
    TopLeft: generateMockGeoCoordinates(),
    BottomRight: generateMockGeoCoordinates(),
    ClusterPrecision: 12
  };
}
