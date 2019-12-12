import { SearchFilterMappingDataObj } from '../../features/search/models';
import { ExchangeJobExchangeDetail } from '../../features/peer/models';
import { generateMockPayMarket, PayMarket } from '../paymarket';
import { generateMockSystemFilter, SystemFilter } from './exchange-job-pay-market-filter.model';
import {
  generateMockGeoCoordinates,
  generateMockMapGeoData,
  GeoCoordinates,
  MapGeoData
} from './exchange-map-response.model';

export interface ExchangeExplorerContextInfo {
  FilterContext: ExchangeDataSearchFilterContext;
  PayMarket: PayMarket;
  AssociatedExchangeJobFilterOptions: ExchangeJobExchangeDetail[];
  SearchFilterMappingData: SearchFilterMappingDataObj;
  InitialMapGeoData: MapGeoData;
}

export interface ExchangeDataSearchFilterContext extends SystemFilter, MapGeoData {
  ScopeGUID: string;
  ClusterPrecision: number;
  ZoomLevel: number;
  LimitToPayMarket: boolean;
  IncludeUntaggedIncumbents: boolean;
  IsFilteredBySimilarExchangeJobIds: boolean;
}

export function generateMockExchangeDataSearchFilterContext(): ExchangeDataSearchFilterContext {
  return {
    ...generateMockSystemFilter(),
    ...generateMockMapGeoData(),
    ScopeGUID: 'MockGUID',
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
    AssociatedExchangeJobFilterOptions: [],
    SearchFilterMappingData: {},
    InitialMapGeoData: generateMockMapGeoData()
  };
}
