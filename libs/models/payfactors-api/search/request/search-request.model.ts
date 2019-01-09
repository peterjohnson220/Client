import { SearchFilter } from '../response';

export interface SearchField {
  Name: string;
  Value: any;
}

export interface PagingOptions {
  From: number;
  Count: number;
}

export interface FilterOptions {
  ReturnFilters: boolean;
  AggregateCount: number;
}

export interface BaseSearchRequest {
  SearchFields: SearchField[];
  Filters: SearchFilter[];
}

export interface BaseProjectSearchRequest extends BaseSearchRequest {
  CountryCode?: string;
  ProjectId: number;
}
