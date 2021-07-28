import {
  BaseSearchAggregationsRequest, BaseSearchRequest, FilterOptions,
  PagingOptions, TempExchangeJobDataCutResponse
} from 'libs/models/payfactors-api';
import { ExchangeDataSearchFilterContext } from 'libs/models/peer';

export interface BaseExchangeDataSearchRequest extends BaseSearchRequest {
  FilterContext: ExchangeDataSearchFilterContext;
  IncludeDisabledFilters?: boolean;
}

export interface ExchangeDataSearchRequest extends BaseExchangeDataSearchRequest {
  PagingOptions?: PagingOptions;
  FilterOptions?: FilterOptions;
}

export interface TempExchangeDataCutDetails {
  TempExchangeJobDataCut: TempExchangeJobDataCutResponse;
  ExchangeDataSearchRequest: BaseExchangeDataSearchRequest;
}

export interface SearchExchangeAggregationsRequest extends BaseExchangeDataSearchRequest, BaseSearchAggregationsRequest { }

export interface QuickPriceExchangeDataSearchRequest extends BaseExchangeDataSearchRequest {
  ViewOnly: boolean;
  CompanyPayMarketId?: number;
  CountryCode?: string;
}

export interface HistoricalExchangeDataSearchRequest extends ExchangeDataSearchRequest {
  From: Date;
  To: Date;
  CalendarInterval: CalendarInterval;
  PeerTrendId: number;
}

export enum CalendarInterval {
  Second,
  Minute,
  Hour,
  Day,
  Week,
  Month,
  Quarter,
  Year
}
