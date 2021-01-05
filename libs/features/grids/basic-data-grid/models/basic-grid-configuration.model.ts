import { SortDescriptor } from '@progress/kendo-data-query';

import { BasicDataViewField, DataViewFilter } from 'libs/models/payfactors-api/reports/request';
import { PagingOptions } from 'libs/models/payfactors-api/search/request';

export interface BasicGridConfiguration {
  BaseEntity: string;
  Fields: BasicDataViewField[];
  Filters: DataViewFilter[];
  ApplyDefaultFilters: boolean;
  Distinct?: boolean;
  PagingOptions?: PagingOptions;
  DefaultSort?: SortDescriptor;
}

export interface BasicGridSettings {
  Sortable: boolean;
  FieldTemplates?: any;
}

export function getDefaultBasicGridSettings(): BasicGridSettings {
  return {
    Sortable: false
  };
}
