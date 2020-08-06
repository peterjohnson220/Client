import { BasicDataViewField, DataViewFilter } from 'libs/models/payfactors-api/reports/request';

export interface BasicGridConfiguration {
  BaseEntity: string;
  Fields: BasicDataViewField[];
  Filters: DataViewFilter[];
  ApplyDefaultFilters: boolean;
  Distinct?: boolean;
}
