import { DataViewFilter } from './data-view-data-request.model';

export interface DataViewFilterOptionsRequest {
  BaseEntityId: number;
  EntitySourceName: string;
  SourceName: string;
  Query: string;
  BaseEntitySourceName: string;
  DisablePagingAndSorting: boolean;
  ApplyDefaultFilters: boolean;
  OptionalFilters: DataViewFilter[];
}
