import { BaseSearchAggregationsRequest, BaseSearchRequest } from '../../search';

export interface RelationalExchangeJobSearchRequest extends BaseSearchRequest {
  ExchangeId: number;
}

export interface RelationalExchangeJobSearchAggregationRequest extends RelationalExchangeJobSearchRequest, BaseSearchAggregationsRequest { }
