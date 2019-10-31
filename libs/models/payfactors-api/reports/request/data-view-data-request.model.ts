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
  DataType?: DataViewFieldDataType;
  IsSelected?: boolean;
  Order?: number;
  IsSortable: boolean;
}

export interface DataViewFilter {
  EntitySourceName: string;
  SourceName: string;
  Operator: string;
  Values?: string[];
  DataType?: DataViewFieldDataType;
}

export enum DataViewFieldDataType {
  Bit = 'bit',
  DateTime = 'dateTime',
  Int = 'int',
  Float = 'float',
  String = 'string',
  LongString = 'longString',
  Binary = 'binary',
  Unknown = 'unknown'
}

export interface DataViewSortDescriptor {
  SortDirection: 'desc' | 'asc';
  SortField: DataViewField;
}
