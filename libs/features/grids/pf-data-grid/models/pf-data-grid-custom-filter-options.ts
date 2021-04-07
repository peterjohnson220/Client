import { DataViewFieldDataType } from 'libs/models/payfactors-api';

export interface PfDataGridCustomFilterOptions {
  EntitySourceName: string;
  SourceName: string;
  FilterDisplayOptions: PfDataGridCustomFilterDisplayOptions[];
  DisplayName?: string;
  DataType?: DataViewFieldDataType;
  FilterOperator?: string;
}

export interface PfDataGridCustomFilterDisplayOptions {
  Value: any;
  Display: string;
}
