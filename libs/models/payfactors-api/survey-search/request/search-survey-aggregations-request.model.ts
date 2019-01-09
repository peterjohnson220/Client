import { BaseSurveySearchRequest } from './survey-search-request.model';

export interface SearchSurveyAggregationsRequest extends BaseSurveySearchRequest {
  SearchField: string;
  TextQuery: string;
  AggregateCount?: number;
}
