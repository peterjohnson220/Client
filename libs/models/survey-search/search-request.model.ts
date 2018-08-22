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

export interface SearchRequest {
  SearchFields: SearchField[];
  Filters: SearchFilter[];
  PagingOptions: PagingOptions;
  FilterOptions: FilterOptions;
  CurrencyCode: string;
  CountryCode: string;
  ProjectId: number;
}
