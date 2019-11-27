import { generateMockGeoCoordinates, GeoCoordinates } from './exchange-map-response.model';
import { SystemFilter } from './exchange-job-pay-market-filter.model';
import { generateMockPayMarketLocation } from './pay-market-location.model';

export interface ExchangeDataSearchFilter extends SystemFilter {
  ExchangeIds: number[];
  Countries: string[];
  States: string[];
  Cities: string[];
  CompanyIds: number[];
  CompanyAssets: string[];
  CompanySizes: string[];
  CompanyRevenues: string[];
  CompanyIndustries: string[];
  ExchangeJobFamilies: string[];
  ExchangeJobLevels: string[];
  ExchangeJobFLSAStatuses: string[];
  TopLeft: GeoCoordinates;
  BottomRight: GeoCoordinates;
  ClusterPrecision: number;
  IsFilteredBySimilarExchangeJobIds: boolean;
  SelectedExchangeScopeId: string;
}

export function generateMockExchangeDataSearchFilter(): ExchangeDataSearchFilter {
  return {
    ExchangeJobIds: [1, 2, 4],
    SimilarExchangeJobIds: [1, 2, 4],
    PayMarketLocation: generateMockPayMarketLocation(),
    ExchangeId: 1,
    ExchangeIds: [1, 2],
    Countries: ['USA', 'CAN'],
    States: ['StateOne'],
    Cities: ['CityOne, StateOne'],
    CompanyIds: [2, 3],
    CompanyAssets: ['MockCompanyAssets'],
    CompanySizes: ['MockCompanySizes'],
    CompanyRevenues: ['MockCompanyRevenues'],
    CompanyIndustries: ['MockCompanyIndustry'],
    ExchangeJobFamilies: ['MockExchangeJobFamily'],
    ExchangeJobLevels: ['MockExchangeJobLevel'],
    ExchangeJobFLSAStatuses: ['MockExchangeJobFLSAStatus'],
    TopLeft: generateMockGeoCoordinates(),
    BottomRight: generateMockGeoCoordinates(),
    ClusterPrecision: 12,
    IsFilteredBySimilarExchangeJobIds: false,
    SelectedExchangeScopeId: null,
    LockedExchangeJobId: 1
  };
}
