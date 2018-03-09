import { generateMockGeoCoordinates, GeoCoordinates } from './exchange-map-response.model';
import {
  ExchangeDataSearchBaseFilter,
  generateMockExchangeDataSearchBaseFilter
} from './exchange-data-search-base-filter.model';

export interface ExchangeDataSearchFilter {
  BaseFilter: ExchangeDataSearchBaseFilter;
  Exchanges: string[];
  States: string[];
  Cities: string[];
  Companies: string[];
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
    BaseFilter: generateMockExchangeDataSearchBaseFilter(),
    Exchanges: ['ExchangeOne'],
    States: ['StateOne'],
    Cities: ['CityOne, StateOne'],
    Companies: ['MockCompany'],
    CompanyIndustries: ['MockCompanyIndustry'],
    ExchangeJobFamilies: ['MockExchangeJobFamily'],
    ExchangeJobLevels: ['MockExchangeJobLevel'],
    ExchangeJobFLSAStatuses: ['MockExchangeJobFLSAStatus'],
    TopLeft: generateMockGeoCoordinates(),
    BottomRight: generateMockGeoCoordinates(),
    ClusterPrecision: 12
  };
}
