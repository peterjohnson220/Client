import { BaseSearchRequest } from './search-request.model';

export interface SearchSurveyAggregationsRequest extends BaseSearchRequest {
  SearchField: string;
  TextQuery: string;
  AggregateCount?: number;
}
