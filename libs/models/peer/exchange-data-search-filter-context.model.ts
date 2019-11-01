import { generateMockSystemFilter, SystemFilter } from './exchange-job-pay-market-filter.model';
import { SearchFilterMappingDataObj } from '../../features/search/models';
import { generateMockPayMarket, PayMarket } from '../paymarket';
import { generateMockGeoCoordinates, GeoCoordinates } from './exchange-map-response.model';

export interface ExchangeExplorerContextInfo {
  FilterContext: ExchangeDataSearchFilterContext;
  PayMarket: PayMarket;
  AssociatedExchangeJobTitleShorts: string[];
  SearchFilterMappingData: SearchFilterMappingDataObj;
}

export interface ExchangeDataSearchFilterContext extends SystemFilter {
  ScopeGUID: string;
  TopLeft: GeoCoordinates;
  BottomRight: GeoCoordinates;
  ClusterPrecision: number;
  ZoomLevel: number;
  LimitToPayMarket: boolean;
  IncludeUntaggedIncumbents: boolean;
  IsFilteredBySimilarExchangeJobIds: boolean;
}

export function generateMockExchangeDataSearchFilterContext(): ExchangeDataSearchFilterContext {
  return {
    ...generateMockSystemFilter(),
    ScopeGUID: 'MockGUID',
    TopLeft: generateMockGeoCoordinates(),
    BottomRight: generateMockGeoCoordinates(),
    ClusterPrecision: 0,
    ZoomLevel: 0.1,
    LimitToPayMarket: true,
    IncludeUntaggedIncumbents: false,
    IsFilteredBySimilarExchangeJobIds: false
  };
}

export function generateMockExchangeExplorerContextInfo(): ExchangeExplorerContextInfo {
  return {
    FilterContext: generateMockExchangeDataSearchFilterContext(),
    PayMarket: generateMockPayMarket(),
    AssociatedExchangeJobTitleShorts: [],
    SearchFilterMappingData: {}
  };
}
