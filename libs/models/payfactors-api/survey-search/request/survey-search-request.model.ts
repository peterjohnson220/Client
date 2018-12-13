import { BaseProjectSearchRequest, FilterOptions, PagingOptions } from '../../search/request';

export interface BaseSurveySearchRequest extends BaseProjectSearchRequest {
  CurrencyCode: string;
}

export interface SurveySearchRequest extends BaseSurveySearchRequest {
  PagingOptions: PagingOptions;
  FilterOptions: FilterOptions;
}
