import {BaseSearchRequest, FilterOptions, PagingOptions} from '../../search/request';

export interface BaseSurveySearchRequest extends BaseSearchRequest {
  CurrencyCode: string;
  CountryCode?: string;
}

export interface SurveySearchRequest extends BaseSurveySearchRequest {
  PagingOptions: PagingOptions;
  FilterOptions: FilterOptions;
  Rate: string;
}
