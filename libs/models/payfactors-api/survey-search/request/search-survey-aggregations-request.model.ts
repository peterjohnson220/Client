import { BaseSurveySearchRequest } from './survey-search-request.model';
import { BaseSearchAggregationsRequest } from '../../search/request';

export interface SearchSurveyAggregationsRequest extends BaseSurveySearchRequest, BaseSearchAggregationsRequest {}
