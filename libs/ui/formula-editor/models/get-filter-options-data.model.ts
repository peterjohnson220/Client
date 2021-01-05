import { DataViewFilter } from '../../../models/payfactors-api/reports/request';

export interface GetFilterOptionsData {
  FilterIndex: number;
  Query: string;
  EntitySourceName: string;
  SourceName: string;
  BaseEntitySourceName: string;
  DisablePagingAndSorting: boolean;
  ApplyDefaultFilters: boolean;
  OptionalFilters: DataViewFilter[];
}
