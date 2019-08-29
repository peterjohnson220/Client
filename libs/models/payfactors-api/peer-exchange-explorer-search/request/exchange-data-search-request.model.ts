import { BaseSearchAggregationsRequest, BaseSearchRequest, FilterOptions, PagingOptions } from '../../search/request';
import { GeoCoordinates, SystemFilter } from '../../../peer';

export interface BaseExchangeDataSearchRequest extends BaseSearchRequest, SystemFilter {
  TopLeft: GeoCoordinates;
  BottomRight: GeoCoordinates;
  ClusterPrecision: number;
  LimitToPayMarket: boolean;
  IncludeUntaggedIncumbents: boolean;
  IsFilteredBySimilarExchangeJobIds: boolean;
}

export interface ExchangeDataSearchRequest extends BaseExchangeDataSearchRequest {
  PagingOptions: PagingOptions;
  FilterOptions: FilterOptions;
}

export interface SearchExchangeAggregationsRequest extends BaseExchangeDataSearchRequest, BaseSearchAggregationsRequest { }
