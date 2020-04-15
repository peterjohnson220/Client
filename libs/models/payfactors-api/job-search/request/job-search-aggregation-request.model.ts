import { BaseJobSearchRequest } from './job-search-request.model';
import { BaseSearchAggregationsRequest } from '../../search/request';

export interface JobSearchAggregationRequest extends BaseJobSearchRequest, BaseSearchAggregationsRequest {
  SearchField: string;
  TextQuery: string;
  AggregateCount?: number;
  Type: string;
}
