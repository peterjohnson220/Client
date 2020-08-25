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
  PagingOptions?: PagingOptions;
}

export interface BaseSearchAggregationsRequest {
  SearchField: string;
  TextQuery: string;
  AggregateCount?: number;
  PagingOptions?: PagingOptions;
}

export interface BaseProjectSearchRequest extends BaseSearchRequest {
  ProjectId: number;
}

export interface BaseStructuresSearchRequest extends BaseSearchRequest {
  StructureRangeGroupId: number;
}
