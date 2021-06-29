import { BaseSearchAggregationsRequest, BaseSearchRequest } from '../../search';

export interface MdJobExchangeJobSearchRequest extends BaseSearchRequest {
  ExchangeId: number;
}

export interface MdJobExchangeJobSearchAggregationRequest extends MdJobExchangeJobSearchRequest, BaseSearchAggregationsRequest { }
