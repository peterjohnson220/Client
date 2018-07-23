import { GenericNameValueDto } from '../common';

export enum SearchType {
  Wild = 'wild',
  Exact = 'exact'
}

export interface SearchField {
  Name: string;
  Value: any;
  SearchType: SearchType;
  Must: boolean;
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
  PagingOptions: PagingOptions;
  FilterOptions: FilterOptions;
}
