import { SearchFilter } from './search-filter.model';

export interface SearchField {
  Name: string;
  Value: any;
}

export interface PagingOptions {
  From: number;
  Count: number;
}

interface FilterOptions {
  ReturnFilters: boolean;
  AggregateCount: number;
}

export interface BaseSearchRequest {
  SearchFields: SearchField[];
  Filters: SearchFilter[];
  CountryCode: string;
  CurrencyCode: string;
  ProjectId: number;
}

export interface SearchRequest extends BaseSearchRequest {
  PagingOptions: PagingOptions;
  FilterOptions: FilterOptions;
}
