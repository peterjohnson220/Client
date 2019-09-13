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
}

export interface DataViewFilter {
  EntitySourceName: string;
  SourceName: string;
  Operator: string;
  Value: string;
  Values?: string[];
  DataType?: DataViewFieldDataType;
}

export enum DataViewFieldDataType {
  Bit,
  DateTime,
  Int,
  Float,
  String,
  Binary,
  Unknown
}

export interface DataViewSortDescriptor {
  SortDirection: 'desc' | 'asc';
  SortField: DataViewField;
}
