import { BaseJobSearchRequest } from './job-search-request.model';

export interface JobSearchAggregationRequest extends BaseJobSearchRequest {
  SearchField: string;
  TextQuery: string;
  AggregateCount?: number;
}
