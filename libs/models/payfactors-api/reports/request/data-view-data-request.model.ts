import { PagingOptions } from '../../search/request';

export interface DataViewDataRequest {
  BaseEntityId: number;
  Fields: DataViewField[];
  Filters: DataViewFilter[];
  PagingOptions: PagingOptions;
  SortDescriptor?: DataViewSortDescriptor;
}

export interface DataViewField {
  EntityId: number;
  Entity: string;
  EntitySourceName: string;
  DataElementId: number;
  SourceName: string;
  DisplayName: string;
  DataType: DataViewFieldDataType;
  IsSelected?: boolean;
  Order?: number;
  IsSortable: boolean;
}

export interface DataViewFilter {
  EntitySourceName: string;
  SourceName: string;
  Operator: string;
  Value?: string;
  Values?: string[];
  DataType?: DataViewFieldDataType;
}

export enum DataViewFieldDataType {
  Bit = 'bit',
  DateTime = 'dateTime',
  Int = 'int',
  Float = 'float',
  String = 'string',
  Binary = 'binary',
  Unknown = 'unknown'
}

export interface DataViewSortDescriptor {
  SortDirection: 'desc' | 'asc';
  SortField: DataViewField;
}

export function getMockDataViewFilter(): DataViewFilter {
  return {
    EntitySourceName: 'CompanyJobs',
    SourceName: 'Job_Title',
    Operator: '=',
    Value: '123',
    Values: [],
    DataType: DataViewFieldDataType.String
  };
}

export function getMockDataViewFilterList(numFilters: number): DataViewFilter[] {
  const filters: DataViewFilter[] = [];
  for (let i = 0; i < numFilters; i++) {
    const filter = {
      EntitySourceName: 'CompanyJobs',
      SourceName: `Job_Title${i}`,
      Operator: '=',
      Value: `Value${i}`,
      Values: [],
      DataType: DataViewFieldDataType.String
    };

    filters.push(filter);
  }
  return filters;
}
