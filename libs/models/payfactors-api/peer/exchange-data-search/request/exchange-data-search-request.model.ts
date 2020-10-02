import { BaseSearchAggregationsRequest, BaseSearchRequest, FilterOptions, PagingOptions } from '../../../search/request';
import { ExchangeDataSearchFilterContext } from '../../../../peer';

export interface BaseExchangeDataSearchRequest extends BaseSearchRequest {
  FilterContext: ExchangeDataSearchFilterContext;
}

export interface ExchangeDataSearchRequest extends BaseExchangeDataSearchRequest {
  PagingOptions?: PagingOptions;
  FilterOptions?: FilterOptions;
}

export interface SearchExchangeAggregationsRequest extends BaseExchangeDataSearchRequest, BaseSearchAggregationsRequest { }

export interface QuickPriceExchangeDataSearchRequest extends BaseExchangeDataSearchRequest {
  ViewOnly: boolean;
  CompanyPayMarketId?: number;
  CountryCode?: string;
}
