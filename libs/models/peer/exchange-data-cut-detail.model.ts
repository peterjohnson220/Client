import { generateMockPayMarket, PayMarket } from '../paymarket';
import { generateMockSystemFilter, SystemFilter } from './exchange-job-pay-market-filter.model';
import { FilterAggregateGroup, generateMockFilterAggregateGroup } from './aggregate-filters';
import { ExchangeMapResponse, generateMockExchangeMapResponse } from './exchange-map-response.model';

export interface ExchangeDataCutDetail {
  SideBarInfo: ExchangeDataCutSideBarInfo;
  MapInfo: ExchangeDataCutMapInfo;
}

export function generateMockExchangeDataCutDetail(): ExchangeDataCutDetail {
  return {
    SideBarInfo: generateMockExchangeDataCutSideBarInfo(),
    MapInfo: generateMockExchangeDataCutMapInfo()
  };
}

export interface ExchangeDataCutSideBarInfo {
  LimitToPayMarket: boolean;
  PayMarket: PayMarket;
  SystemFilter: SystemFilter;
  Selections: any;
  FilterAggregateSelections: FilterAggregateGroup[];
  FilterAggregateGroups: FilterAggregateGroup[];
  SelectionsCount: number;
}

export function generateMockExchangeDataCutSideBarInfo(): ExchangeDataCutSideBarInfo {
  return {
    LimitToPayMarket: false,
    PayMarket: generateMockPayMarket(),
    SystemFilter: generateMockSystemFilter(),
    Selections: {},
    FilterAggregateSelections: [generateMockFilterAggregateGroup()],
    FilterAggregateGroups: [generateMockFilterAggregateGroup()],
    SelectionsCount: 0
  };
}

export interface ExchangeDataCutMapInfo {
  MapResponse: ExchangeMapResponse;
  ClusterPrecision: number;
  ZoomLevel: number;
}

export function generateMockExchangeDataCutMapInfo(): ExchangeDataCutMapInfo {
  return {
    MapResponse: generateMockExchangeMapResponse(),
    ClusterPrecision: 0,
    ZoomLevel: 0
  };
}
