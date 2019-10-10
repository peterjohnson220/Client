import { BaseSearchAggregationsRequest, BaseSearchRequest, FilterOptions, PagingOptions } from '../../search/request';
import { ExchangeDataSearchFilterContext, GeoCoordinates, SystemFilter } from '../../../peer';
import { SearchFilterMappingDataObj } from '../../../../features/search/models';

export interface BaseExchangeDataSearchRequest extends BaseSearchRequest {
  FilterContext: ExchangeDataSearchFilterContext;
  SearchFilterMappingData: SearchFilterMappingDataObj;
}

export interface ExchangeDataSearchRequest extends BaseExchangeDataSearchRequest {
  PagingOptions?: PagingOptions;
  FilterOptions?: FilterOptions;
}

export interface SearchExchangeAggregationsRequest extends BaseExchangeDataSearchRequest, BaseSearchAggregationsRequest { }
